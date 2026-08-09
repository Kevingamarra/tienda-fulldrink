import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartDrawer.css";

function CartDrawer() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const handleContinue = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "show" : ""}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <div>
            <span>FULL DRINKS</span>
            <h2>Tu carrito</h2>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-drawer-content">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <i className="bi bi-cart3"></i>

              <h3>Tu carrito está vacío</h3>

              <p>
                Agregá productos para comenzar tu pedido.
              </p>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
              >
                SEGUIR COMPRANDO
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className={
                          item.id === "gin-02"
                            ? "cart-image-blackberry"
                            : ""
                        }
                      />
                    </div>

                    <div className="cart-item-info">
                      <span className="cart-item-category">
                        {item.category}
                      </span>

                      <h3>{item.name}</h3>

                      {item.size && <p>{item.size}</p>}

                      <strong>
                        {typeof item.price === "number"
                          ? `$${item.price.toLocaleString("es-AR")}`
                          : "Consultar"}
                      </strong>

                      <div className="cart-item-controls">
                        <div className="cart-quantity">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-footer">
                <button
                  type="button"
                  className="cart-clear"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>

                <div className="cart-total">
                  <span>Total</span>

                  <strong>
                    {totalPrice > 0
                      ? `$${totalPrice.toLocaleString("es-AR")}`
                      : "A confirmar"}
                  </strong>
                </div>

                <button
                  type="button"
                  className="cart-checkout"
                  onClick={handleContinue}
                >
                  <i className="bi bi-arrow-right"></i>
                  CONTINUAR
                </button>

                <p>
                  Completá tus datos, entrega y horario en el siguiente paso.
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;
