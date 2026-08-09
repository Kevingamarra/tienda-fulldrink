import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  const {
    admin,
    loadingAdmin,
    login,
  } = useAdminAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  if (loadingAdmin) {
    return null;
  }

  if (admin) {
    return (
      <Navigate
        to="/admin/pedidos"
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await login(email, password);

      navigate("/admin/pedidos", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span>FULL DRINKS</span>
          <h1>Administrador</h1>
          <p>
            Ingresá para gestionar pedidos y stock.
          </p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "INGRESANDO..."
              : "INGRESAR"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;
