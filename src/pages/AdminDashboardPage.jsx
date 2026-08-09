import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrders } from "../services/ordersApi";
import { useCatalog } from "../context/CatalogContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const { products, combos } = useCatalog();
  const { admin, logout } = useAdminAuth();

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadOrders();
  }, []);

  const catalog = useMemo(
    () => [...products, ...combos],
    [products, combos]
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed"
  );

  const today = new Date().toDateString();

  const confirmedToday = confirmedOrders.filter(
    (order) =>
      new Date(order.confirmedAt || order.updatedAt)
        .toDateString() === today
  );

  const salesToday = confirmedToday.reduce(
    (total, order) => total + order.total,
    0
  );

  const outOfStock = catalog.filter(
    (item) => item.stock <= 0
  );

  const lowStock = catalog.filter(
    (item) => item.stock > 0 && item.stock <= 2
  );

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div>
            <span>FULL DRINKS ADMIN</span>
            <h1>Dashboard</h1>
            <p>{admin?.email}</p>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            CERRAR SESIÓN
          </button>
        </header>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        <section className="admin-dashboard-cards">
          <article>
            <span>Pedidos pendientes</span>
            <strong>{pendingOrders.length}</strong>
          </article>

          <article>
            <span>Confirmados hoy</span>
            <strong>{confirmedToday.length}</strong>
          </article>

          <article>
            <span>Ventas de hoy</span>
            <strong>
              ${salesToday.toLocaleString("es-AR")}
            </strong>
          </article>

          <article>
            <span>Sin stock</span>
            <strong>{outOfStock.length}</strong>
          </article>

          <article>
            <span>Stock bajo</span>
            <strong>{lowStock.length}</strong>
          </article>
        </section>

        <section className="admin-dashboard-links">
          <Link to="/admin/pedidos">
            <i className="bi bi-receipt"></i>

            <div>
              <strong>Pedidos</strong>
              <span>
                Confirmar, cancelar y revisar ventas
              </span>
            </div>
          </Link>

          <Link to="/admin/estadisticas">
            <i className="bi bi-graph-up-arrow"></i>

            <div>
              <strong>Estadísticas</strong>
              <span>
                Ventas y productos más vendidos
              </span>
            </div>
          </Link>

          <Link to="/admin/productos">
            <i className="bi bi-box-seam"></i>

            <div>
              <strong>Productos</strong>
              <span>
                Administrar catálogo
              </span>
            </div>
          </Link>

          <Link to="/admin/stock">
            <i className="bi bi-box-seam"></i>

            <div>
              <strong>Stock</strong>
              <span>
                Administrar existencias
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
