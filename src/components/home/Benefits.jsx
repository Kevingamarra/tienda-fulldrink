import { Link } from "react-router-dom";
import mapaEnvios from "../../assets/images/info/envios-cobertura.png";
import "./Benefits.css";

const benefits = [
  {
    icon: "bi-truck",
    title: "ENVÍOS",
    text: "Coordinamos tu entrega",
    link: "/envios",
    image: mapaEnvios,
  },
  {
    icon: "bi-credit-card",
    title: "PAGOS",
    text: "Opciones simples y seguras",
  },
  {
    icon: "bi-whatsapp",
    title: "ATENCIÓN",
    text: "Contacto directo",
  },
  {
    icon: "bi-shield-check",
    title: "PRODUCTOS",
    text: "Selección Full Drinks",
  },
];

function Benefits() {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        {benefits.map((benefit) => {
          const content = (
            <>
              <div className="benefit-main">
                <div className="benefit-icon">
                  <i className={`bi ${benefit.icon}`}></i>
                </div>

                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </div>

              {benefit.image && (
                <div className="benefit-map">
                  <img
                    src={benefit.image}
                    alt="Mapa de cobertura de envíos sin costo"
                  />
                  <span>Ver zona de cobertura</span>
                </div>
              )}
            </>
          );

          return benefit.link ? (
            <Link
              to={benefit.link}
              className="benefit-item benefit-item-link"
              key={benefit.title}
            >
              {content}
            </Link>
          ) : (
            <article className="benefit-item" key={benefit.title}>
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Benefits;
