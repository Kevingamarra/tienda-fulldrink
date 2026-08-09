import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/ordersApi";
import "./AdminStatsPage.css";

function AdminStatsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const confirmed = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === "confirmed"
      ),
    [orders]
  );

  const totalSales = confirmed.reduce(
    (total, order) =>
      total + order.total,
    0
  );

  const productSales = useMemo(() => {
    const map = new Map();

    confirmed.forEach((order) => {
      order.items.forEach((item) => {
        const current =
          map.get(item.name) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };

        current.quantity += item.quantity;
        current.revenue += item.subtotal;

        map.set(item.name, current);
      });
    });

    return [...map.values()].sort(
      (a, b) =>
        b.quantity - a.quantity
    );
  }, [confirmed]);

  const averageTicket =
    confirmed.length > 0
      ? totalSales / confirmed.length
      : 0;

  if (loading) {
    return (
      <main className="admin-stats-page">
        <div className="admin-stats-container">
          Cargando estadísticas...
        </div>
      </main>
    );
  }

  return (
    <main className="admin-stats-page">
      <div className="admin-stats-container">
        <header className="admin-stats-header">
          <div>
            <span>FULL DRINKS ADMIN</span>
            <h1>Estadísticas</h1>
          </div>

          <Link to="/admin">
            <i className="bi bi-arrow-left"></i>
            DASHBOARD
          </Link>
        </header>

        <section className="admin-stats-summary">
          <article>
            <span>Ventas confirmadas</span>
            <strong>
              {confirmed.length}
            </strong>
          </article>

          <article>
            <span>Facturación total</span>
            <strong>
              $
              {totalSales.toLocaleString(
                "es-AR"
              )}
            </strong>
          </article>

          <article>
            <span>Ticket promedio</span>
            <strong>
              $
              {Math.round(
                averageTicket
              ).toLocaleString("es-AR")}
            </strong>
          </article>
        </section>

        <section className="admin-products-ranking">
          <div className="admin-ranking-title">
            <span>RANKING</span>
            <h2>Productos más vendidos</h2>
          </div>

          {productSales.length === 0 ? (
            <p className="admin-ranking-empty">
              Todavía no hay ventas confirmadas.
            </p>
          ) : (
            <div className="admin-ranking-list">
              {productSales.map(
                (product, index) => (
                  <article
                    key={product.name}
                  >
                    <span className="admin-ranking-position">
                      #{index + 1}
                    </span>

                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.quantity}{" "}
                        unidades vendidas
                      </span>
                    </div>

                    <strong className="admin-ranking-revenue">
                      $
                      {product.revenue.toLocaleString(
                        "es-AR"
                      )}
                    </strong>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminStatsPage;
