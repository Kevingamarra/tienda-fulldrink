import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  cancelOrder,
  confirmOrder,
  getOrders,
} from "../services/ordersApi";
import { useCatalog } from "../context/CatalogContext";
import "./AdminOrdersPage.css";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { refreshCatalog } = useCatalog();

  const loadOrders = async () => {
    try {
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      const code = order._id
        .slice(-6)
        .toUpperCase();

      const productsText = order.items
        .map((item) => item.name)
        .join(" ")
        .toLowerCase();

      const customerText = `
        ${order.customerName || ""}
        ${order.customerPhone || ""}
      `.toLowerCase();

      const matchesSearch =
        !cleanSearch ||
        code.toLowerCase().includes(cleanSearch) ||
        productsText.includes(cleanSearch) ||
        customerText.includes(cleanSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const handleConfirm = async (order) => {
    const code = order._id
      .slice(-6)
      .toUpperCase();

    const ok = window.confirm(
      `¿Confirmar el pedido #${code}?`
    );

    if (!ok) return;

    try {
      setProcessingId(order._id);
      setMessage("");
      setError("");

      await confirmOrder(order._id);
      await refreshCatalog();
      await loadOrders();

      setMessage(
        `Pedido #${code} confirmado correctamente.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (order) => {
    const code = order._id
      .slice(-6)
      .toUpperCase();

    const ok = window.confirm(
      `¿Cancelar el pedido #${code}?`
    );

    if (!ok) return;

    try {
      setProcessingId(order._id);
      setMessage("");
      setError("");

      await cancelOrder(order._id);
      await refreshCatalog();
      await loadOrders();

      setMessage(
        `Pedido #${code} cancelado. Stock liberado.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "confirmed") {
      return {
        text: "Confirmado",
        className: "admin-order-confirmed",
      };
    }

    if (status === "cancelled") {
      return {
        text: "Cancelado",
        className: "admin-order-cancelled",
      };
    }

    return {
      text: "Pendiente",
      className: "admin-order-pending",
    };
  };

  if (loading) {
    return (
      <main className="admin-orders-page">
        <div className="admin-orders-container">
          <p className="admin-orders-loading">
            Cargando pedidos...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-orders-page">
      <div className="admin-orders-container">
        <header className="admin-orders-header">
          <div>
            <span>FULL DRINKS ADMIN</span>
            <h1>Pedidos</h1>
            <div className="admin-orders-line"></div>
          </div>

          <div className="admin-orders-header-actions">
            <Link
              to="/admin"
              className="admin-back-dashboard"
            >
              <i className="bi bi-arrow-left"></i>
              DASHBOARD
            </Link>

            <button
              type="button"
              className="admin-refresh"
              onClick={loadOrders}
            >
              <i className="bi bi-arrow-clockwise"></i>
              ACTUALIZAR
            </button>
          </div>
        </header>

        <div className="admin-orders-tools">
          <div className="admin-orders-filters">
            {[
              ["all", "Todos"],
              ["pending", "Pendientes"],
              ["confirmed", "Confirmados"],
              ["cancelled", "Cancelados"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  statusFilter === value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setStatusFilter(value)
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="admin-orders-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Buscar pedido, producto o cliente..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {message && (
          <div className="admin-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-message error">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="admin-orders-empty">
            <i className="bi bi-receipt"></i>
            <h2>No encontramos pedidos</h2>
            <p>
              Probá cambiando el filtro o la búsqueda.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {filteredOrders.map((order) => {
              const status =
                getStatusLabel(order.status);

              const code = order._id
                .slice(-6)
                .toUpperCase();

              return (
                <article
                  className="admin-order-card"
                  key={order._id}
                >
                  <div className="admin-order-top">
                    <div>
                      <span className="admin-order-code">
                        PEDIDO #{code}
                      </span>

                      <p>
                        {new Date(
                          order.createdAt
                        ).toLocaleString("es-AR")}
                      </p>
                    </div>

                    <span
                      className={`admin-order-status ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <div className="admin-customer-box">
                    <div>
                      <span>Cliente</span>
                      <strong>
                        {order.customerName ||
                          "Sin nombre"}
                      </strong>
                    </div>

                    <div>
                      <span>Teléfono</span>
                      <strong>
                        {order.customerPhone ||
                          "Sin teléfono"}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-order-items">
                    {order.items.map((item) => (
                      <div
                        className="admin-order-item"
                        key={item._id}
                      >
                        <span>
                          {item.quantity}x{" "}
                          {item.name}
                        </span>

                        <strong>
                          $
                          {item.subtotal.toLocaleString(
                            "es-AR"
                          )}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-details">
                    <div>
                      <span>Entrega</span>
                      <strong>
                        {order.deliveryType ===
                        "envio"
                          ? "Envío a domicilio"
                          : "Retiro por el local"}
                      </strong>
                    </div>

                    {order.deliveryDate && (
                      <div>
                        <span>Día</span>
                        <strong>
                          {new Date(
                            `${order.deliveryDate}T12:00:00`
                          ).toLocaleDateString(
                            "es-AR",
                            {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </strong>
                      </div>
                    )}

                    {order.deliverySlot && (
                      <div>
                        <span>
                          {order.deliveryType === "envio"
                            ? "Horario de envío"
                            : "Horario de retiro"}
                        </span>

                        <strong>
                          {order.deliverySlot}
                        </strong>
                      </div>
                    )}

                    {order.deliveryType ===
                      "envio" &&
                      order.address && (
                        <div>
                          <span>Dirección</span>
                          <strong>
                            {order.address}
                          </strong>
                        </div>
                      )}

                    {order.deliveryType ===
                      "retiro" && (
                        <div>
                          <span>Punto de retiro</span>
                          <strong>
                            Mercedes 2830, Villa Granaderos de San Martín
                          </strong>
                        </div>
                      )}

                    <div>
                      <span>Pago</span>
                      <strong>
                        {order.paymentMethod ===
                        "transferencia"
                          ? "Transferencia"
                          : "Efectivo"}
                      </strong>
                    </div>

                    <div>
                      <span>Observaciones</span>
                      <strong>
                        {order.notes ||
                          "Sin observaciones"}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-order-total">
                    <span>Total</span>

                    <strong>
                      $
                      {order.total.toLocaleString(
                        "es-AR"
                      )}
                    </strong>
                  </div>

                  {order.status === "pending" && (
                    <div className="admin-order-actions">
                      <button
                        type="button"
                        className="admin-confirm"
                        disabled={
                          processingId ===
                          order._id
                        }
                        onClick={() =>
                          handleConfirm(order)
                        }
                      >
                        <i className="bi bi-check-lg"></i>
                        CONFIRMAR PEDIDO
                      </button>

                      <button
                        type="button"
                        className="admin-cancel"
                        disabled={
                          processingId ===
                          order._id
                        }
                        onClick={() =>
                          handleCancel(order)
                        }
                      >
                        <i className="bi bi-x-lg"></i>
                        CANCELAR
                      </button>
                    </div>
                  )}

                  {order.status === "confirmed" &&
                    order.confirmedAt && (
                      <div className="admin-order-processed">
                        Confirmado el{" "}
                        {new Date(
                          order.confirmedAt
                        ).toLocaleString("es-AR")}
                      </div>
                    )}

                  {order.status === "cancelled" &&
                    order.cancelledAt && (
                      <div className="admin-order-processed">
                        Cancelado el{" "}
                        {new Date(
                          order.cancelledAt
                        ).toLocaleString("es-AR")}
                      </div>
                    )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminOrdersPage;
