import { useNavigate } from "react-router-dom";

import ginImg from "../../assets/images/categorias/gin.png";
import vodkaImg from "../../assets/images/categorias/vodka.png";
import whiskyImg from "../../assets/images/categorias/whisky.png";
import espumantesImg from "../../assets/images/categorias/espumantes.png";
import combosImg from "../../assets/images/categorias/combos.png";

import "./Categories.css";

const categories = [
  { name: "Gin", slug: "gin", image: ginImg },
  { name: "Vodka", slug: "vodka", image: vodkaImg },
  { name: "Whisky", slug: "whisky", image: whiskyImg },
  { name: "Espumantes", slug: "espumantes", image: espumantesImg },
  { name: "Combos", slug: "combos", image: combosImg },
];

function Categories() {
  const navigate = useNavigate();

  return (
    <section className="categories-section" id="categorias">
      <div className="categories-container">
        <div className="categories-heading">
          <h2>CATEGORÍAS</h2>
          <span></span>
        </div>

        <div className="categories-row">
          {categories.map((category) => (
            <button
              className="category-item"
              key={category.slug}
              type="button"
              onClick={() =>
                category.slug === "combos"
                  ? navigate("/combos")
                  : navigate(`/categoria/${category.slug}`)
              }
            >
              <div className="category-circle">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <p>{category.name}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
