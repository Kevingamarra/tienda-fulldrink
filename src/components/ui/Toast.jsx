import { useCart } from "../../context/CartContext";
import "./Toast.css";

function Toast() {
  const { toast, setToast } = useCart();

  if (!toast) {
    return null;
  }

  return (
    <div className={`full-toast full-toast-${toast.type}`}>
      <div className="full-toast-icon">
        {toast.type === "success" && "✓"}
        {toast.type === "warning" && "⚠"}
        {toast.type === "error" && "×"}
      </div>

      <div className="full-toast-content">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button
        type="button"
        className="full-toast-close"
        onClick={() => setToast(null)}
        aria-label="Cerrar aviso"
      >
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
}

export default Toast;
