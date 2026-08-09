import { Link, useNavigate } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import "./CombosPage.css";
import "./CategoryPage.css";

function CombosPage() {
  const navigate = useNavigate();
  const { combos } = useCatalog();
  return (
    <main className="all-combos-page">
      <div className="all-combos-container">

        <button
          type="button"
          className="category-back-button"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          Volver
        </button>
        <header className="all-combos-header">
          <div>
            <h1>TODOS LOS COMBOS</h1>
            <span></span>
          </div>

          <p>Elegí tu combo favorito de Full Drinks.</p>
        </header>

        <div className="all-combos-grid">
          {combos.map((combo) => (
            <article className="all-combo-card" key={combo.id}>
              <div className="all-combo-image">
                <img
                  src={combo.image}
                  alt={combo.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="all-combo-info">
                <span>COMBO</span>

                <h2>{combo.name}</h2>

                <p className="all-combo-includes">
                  {combo.includes}
                </p>

                <div className="all-combo-bottom">
                  <strong>
                    ${combo.price.toLocaleString("es-AR")}
                  </strong>

                  <Link
                    to={`/combo/${combo.id}`}
                    className="all-combo-button"
                  >
                    VER COMBO
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default CombosPage;
