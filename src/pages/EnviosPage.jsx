import { Link } from "react-router-dom";
import mapaEnvios from "../assets/images/info/envios-cobertura.png";
import "./EnviosPage.css";

function EnviosPage() {
  return (
    <main className="envios-page">
      <div className="envios-container">
        <Link to="/" className="envios-back">
          <i className="bi bi-arrow-left"></i>
          Volver al inicio
        </Link>

        <section className="envios-content">
          <div className="envios-heading">
            <span>🚚 FULL DRINKS</span>
            <h1>ENVÍOS SIN COSTO</h1>
            <p>
              Realizamos entregas sin cargo dentro de nuestra zona de cobertura.
            </p>
          </div>

          <div className="envios-map-card">
            <img
              src={mapaEnvios}
              alt="Mapa de cobertura de entregas sin costo de Full Drinks"
            />
          </div>

          <div className="envios-info">
            <h2>📍 Zona de cobertura</h2>

            <p>
              Si tu domicilio se encuentra dentro del área marcada en el mapa,
              la entrega no tiene costo.
            </p>

            <p>
              Si estás cerca del límite o tenés dudas sobre tu ubicación,
              consultanos por WhatsApp y te confirmamos.
            </p>

            <a
              href="https://wa.me/message/IUSFIUWOQFHCI1"
              target="_blank"
              rel="noreferrer"
              className="envios-whatsapp"
            >
              <i className="bi bi-whatsapp"></i>
              CONSULTAR MI UBICACIÓN
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EnviosPage;
