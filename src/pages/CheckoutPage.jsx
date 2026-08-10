import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import { createPendingOrder } from "../services/ordersApi";
import { getDeliverySchedule } from "../services/deliveryApi";
import "./CheckoutPage.css";

function CheckoutPage() {
  const {
    cart,
    totalPrice,
    clearCart,
    showToast,
  } = useCart();

  const { refreshCatalog } = useCatalog();

  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [deliveryType, setDeliveryType] = useState("envio");
  const [address, setAddress] = useState("");

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; dates.length < 6 && i < 60; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const day = date.getDay();

      if (day === 5 || day === 6) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const dayNumber = String(date.getDate()).padStart(2, "0");

        const label = date.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        });

        dates.push({
          value: `${year}-${month}-${dayNumber}`,
          label: label.charAt(0).toUpperCase() + label.slice(1),
        });
      }
    }

    return dates;
  }, []);

  useEffect(() => {
    setSchedule([]);

    if (!deliveryDate) {
      return;
    }

    async function loadSchedule() {
      try {
        setLoadingSchedule(true);

        const data = await getDeliverySchedule(
          deliveryDate,
          deliveryType
        );

        setSchedule(data.slots);
      } catch (error) {
        showToast(
          "No se pudieron cargar los horarios",
          error.message,
          "error"
        );
      } finally {
        setLoadingSchedule(false);
      }
    }

    loadSchedule();
  }, [deliveryDate, deliveryType]);

  const validate = () => {
    if (!customerName.trim()) {
      showToast(
        "Falta tu nombre",
        "Ingresá tu nombre y apellido.",
        "warning"
      );
      return false;
    }

    if (!customerPhone.trim()) {
      showToast(
        "Falta tu teléfono",
        "Ingresá un teléfono de contacto.",
        "warning"
      );
      return false;
    }

    if (deliveryType === "envio" && !address.trim()) {
      showToast(
        "Falta la dirección",
        "Ingresá la dirección de entrega.",
        "warning"
      );
      return false;
    }

    if (!deliveryDate) {
      showToast(
        "Falta el día",
        "Seleccioná viernes o sábado.",
        "warning"
      );
      return false;
    }

    if (!deliverySlot) {
      showToast(
        "Falta el horario",
        "Seleccioná un horario.",
        "warning"
      );
      return false;
    }

    if (cart.length === 0) {
      showToast(
        "Carrito vacío",
        "Agregá productos antes de finalizar.",
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validate()) return;

    const whatsappWindow = window.open("", "_blank");

    try {
      setSubmitting(true);

      const order = await createPendingOrder({
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType,
        deliveryDate,
        deliverySlot,
        address:
          deliveryType === "envio"
            ? address.trim()
            : "",
        paymentMethod,
        notes: notes.trim(),
      });

      await refreshCatalog();

      const orderCode = order._id
        .slice(-6)
        .toUpperCase();

      const selectedDateLabel =
        availableDates.find(
          (item) => item.value === deliveryDate
        )?.label || deliveryDate;

      const deliveryDescription =
        deliveryType === "envio"
          ? `🚚 Envío a domicilio
📍 Dirección: ${address.trim()}`
          : `🏠 Retiro por el local
📍 Mercedes 2830, Villa Granaderos de San Martín`;

      const paymentDescription =
        paymentMethod === "efectivo"
          ? "💵 Efectivo"
          : "🏦 Transferencia";

      const message = `🍸 ¡Hola Full Drinks!

🧾 Pedido #${orderCode}

👤 Cliente: ${customerName.trim()}
📞 Teléfono: ${customerPhone.trim()}

${deliveryDescription}
📅 Día: ${selectedDateLabel}
🕒 Horario: ${deliverySlot}

💳 Pago: ${paymentDescription}

📝 Observaciones:
${notes.trim() || "Sin observaciones"}

📲 Acabo de realizar mi pedido desde la tienda online.
Cuando puedas, confirmame el pedido. ¡Gracias! 🥂`;

      const whatsappParams = new URLSearchParams({
        phone: "5491155289550",
        text: message,
      });

      const whatsappUrl =
        `https://api.whatsapp.com/send?${whatsappParams.toString()}`;

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      clearCart();

      showToast(
        "Pedido registrado",
        `Pedido #${orderCode} creado correctamente.`,
        "success"
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      if (whatsappWindow) {
        whatsappWindow.close();
      }

      if (
        error.message
          .toLowerCase()
          .includes("horario")
      ) {
        try {
          const data = await getDeliverySchedule(
            deliveryDate,
            deliveryType
          );

          setSchedule(data.slots);
          setDeliverySlot("");
        } catch {
          // El toast principal ya informa el problema.
        }
      }

      showToast(
        "No se pudo crear el pedido",
        error.message,
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <i className="bi bi-cart3"></i>
          <h1>Tu carrito está vacío</h1>
          <Link to="/">
            VOLVER A LA TIENDA
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <div>
            <span>FULL DRINKS</span>
            <h1>Finalizar pedido</h1>
          </div>

          <Link to="/">
            <i className="bi bi-arrow-left"></i>
            VOLVER
          </Link>
        </header>

        <div className="checkout-layout">
          <section className="checkout-form">
            <div className="checkout-section">
              <h2>1. Tus datos</h2>

              <input
                type="text"
                placeholder="Nombre y apellido"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
              />

              <input
                type="tel"
                placeholder="Teléfono"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(event.target.value)
                }
              />
            </div>

            <div className="checkout-section">
              <h2>2. Entrega</h2>

              <div className="checkout-options">
                <label>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="envio"
                    checked={deliveryType === "envio"}
                    onChange={(event) => {
                      setDeliveryType(event.target.value);
                      setDeliveryDate("");
                      setDeliverySlot("");
                    }}
                  />

                  <span>
                    Envío a domicilio
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="retiro"
                    checked={deliveryType === "retiro"}
                    onChange={(event) => {
                      setDeliveryType(event.target.value);
                      setDeliveryDate("");
                      setDeliverySlot("");
                    }}
                  />

                  <span>
                    Retiro por el local
                  </span>
                </label>
              </div>

              {deliveryType === "envio" ? (
                <input
                  type="text"
                  placeholder="Dirección de entrega"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                />
              ) : (
                <div className="checkout-pickup-location">
                  <div className="checkout-pickup-address">
                    <i className="bi bi-geo-alt-fill"></i>

                    <div>
                      <span>Punto de retiro</span>

                      <strong>
                        Mercedes 2830
                      </strong>

                      <p>
                        Villa Granaderos de San Martín
                      </p>
                    </div>
                  </div>

                  <div className="checkout-pickup-map">
                    <iframe
                      title="Ubicación Full Drinks"
                      src="https://www.google.com/maps?q=-34.5545915,-58.5259559&z=17&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <a
                    className="checkout-map-link"
                    href="https://maps.app.goo.gl/NesXi1dXzEfesCF96?g_st=ic"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-geo-alt"></i>
                    ABRIR EN GOOGLE MAPS
                  </a>
                </div>
              )}
            </div>

            <div className="checkout-section">
              <h2>3. Día</h2>

              <div className="checkout-date-grid">
                {availableDates.map((date) => (
                  <button
                    key={date.value}
                    type="button"
                    className={
                      deliveryDate === date.value
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      setDeliveryDate(date.value);
                      setDeliverySlot("");
                    }}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="checkout-section">
              <h2>4. Horario</h2>

              {!deliveryDate ? (
                <p className="checkout-helper">
                  Primero seleccioná un día.
                </p>
              ) : loadingSchedule ? (
                <p className="checkout-helper">
                  Cargando horarios...
                </p>
              ) : (
                <div className="checkout-slot-grid">
                  {schedule.map((item) => (
                    <button
                      key={item.slot}
                      type="button"
                      disabled={!item.available}
                      className={
                        deliverySlot === item.slot
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setDeliverySlot(item.slot)
                      }
                    >
                      <span>{item.slot}</span>

                      {deliveryType === "envio" &&
                        !item.available && (
                          <small>Ocupado</small>
                        )}
                    </button>
                  ))}
                </div>
              )}

              {deliveryType === "envio" && (
                <p className="checkout-helper">
                  Cada turno de envío es exclusivo para un cliente.
                </p>
              )}

              {deliveryType === "retiro" && (
                <p className="checkout-helper">
                  Podés retirar dentro de la franja seleccionada.
                </p>
              )}
            </div>

            <div className="checkout-section">
              <h2>5. Forma de pago</h2>

              <div className="checkout-options">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="efectivo"
                    checked={paymentMethod === "efectivo"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <span>Efectivo</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transferencia"
                    checked={
                      paymentMethod === "transferencia"
                    }
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <span>Transferencia</span>
                </label>
              </div>
            </div>

            <div className="checkout-section">
              <h2>6. Observaciones</h2>

              <textarea
                placeholder="Ej: tocar timbre, departamento, referencia..."
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
              />
            </div>
          </section>

          <aside className="checkout-summary">
            <h2>Resumen</h2>

            <div className="checkout-summary-items">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="checkout-summary-item"
                >
                  <div>
                    <span>
                      {item.quantity}x
                    </span>

                    <strong>
                      {item.name}
                    </strong>
                  </div>

                  <strong>
                    $
                    {(
                      item.price * item.quantity
                    ).toLocaleString("es-AR")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-total">
              <span>Total</span>

              <strong>
                $
                {totalPrice.toLocaleString(
                  "es-AR"
                )}
              </strong>
            </div>

            <button
              type="button"
              className="checkout-submit"
              disabled={submitting}
              onClick={handleCheckout}
            >
              <i className="bi bi-whatsapp"></i>

              {submitting
                ? "PROCESANDO..."
                : "FINALIZAR POR WHATSAPP"}
            </button>

            <p>
              El stock y, si corresponde, el turno de envío
              quedan reservados al registrar el pedido.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
