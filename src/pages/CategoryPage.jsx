import { useNavigate, useParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import "../components/home/FeaturedProducts.css";
import "./CategoryPage.css";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products } = useCatalog();

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  const title =
    category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <main className="category-page">
      <section className="featured-container">
        <button
          type="button"
          className="category-back-button"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          Volver
        </button>

        <div className="featured-header">
          <div>
            <h2>{title}</h2>
            <span className="featured-line"></span>
          </div>
        </div>

        <div className="featured-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-area">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-real-image"
                  />
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  {product.size && <p>{product.size}</p>}

                  <div className="product-bottom">
                    <strong>
                      {product.price !== null
                        ? `$${product.price.toLocaleString("es-AR")}`
                        : "Consultar"}
                    </strong>

                    <button
                      type="button"
                      className="add-cart-button"
                      aria-label={`Agregar ${product.name} al carrito`}
                    >
                      <i className="bi bi-cart3"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="category-empty">
              Todavía no hay productos en esta categoría.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default CategoryPage;
