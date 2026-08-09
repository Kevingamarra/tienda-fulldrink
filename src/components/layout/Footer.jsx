import { Link } from "react-router-dom";
import logo from "../../assets/images/logo/logo.jpg";
import "./Footer.css";

function Footer() {
  const instagramUrl =
    "https://www.instagram.com/fulldrinks.shop?igsh=MXRmcmgwazBleWx5NQ==";

  const whatsappUrl =
    "https://wa.me/message/IUSFIUWOQFHCI1";

  return (
    <footer className="main-footer" id="contacto">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src={logo}
            alt="Full Drinks"
            className="footer-logo-img"
          />

          <p>
            Bebidas, combos y productos seleccionados con la identidad de Full Drinks.
          </p>

          <div className="footer-socials">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Full Drinks"
            >
              <i className="bi bi-instagram"></i>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp de Full Drinks"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>TIENDA</h3>
          <a href="#productos">Productos</a>
          <a href="#combos">Combos</a>
          <a href="#categorias">Categorías</a>
        </div>

        <div className="footer-column">
          <h3>AYUDA</h3>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">📲 Contacto</a>
          <p><strong>💳 Medios de pago</strong></p>
          <p>Aceptamos efectivo y transferencia bancaria.</p>
          <p>El pago se coordina al confirmar el pedido.</p>
          <Link to="/envios">🚚 Envíos</Link>
        </div>

        <div className="footer-column footer-contact">
          <h3>CONTACTO</h3>

          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <i className="bi bi-whatsapp"></i>
            WhatsApp
          </a>

          <a href={instagramUrl} target="_blank" rel="noreferrer">
            <i className="bi bi-instagram"></i>
            @fulldrinks.shop
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Full Drinks</span>
        <span>Bebidas y más</span>
      </div>
    </footer>
  );
}

export default Footer;
