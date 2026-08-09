import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCatalog } from "../../context/CatalogContext";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const { addToCart } = useCart();
  const { products } = useCatalog();

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 6);

  const getStockInfo = (stock) => {
    if (stock <= 0) {
      return {
        className: "stock-out",
        text: "🔴 Sin stock",
      };
    }

    if (stock <= 2) {
      return {
        className: "stock-low",
        text:
          stock === 1
            ? "🟠 Última unidad"
            : `🟠 Últimas ${stock} unidades`,
      };
    }

    return {
      className: "stock-available",
      text: `🟢 Disponible (${stock})`,
    };
  };

  return (
    <section className="featured-section" id="productos">
      <div className="featured-container">
        <div className="featured-header">
          <div>
            <h2>DESTACADOS</h2>
            <span className="featured-line"></span>
          </div>

          <Link to="/productos" className="view-all">
            VER TODOS
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => {
            const stockInfo = getStockInfo(product.stock);

            return (
              <article className="product-card" key={product.id}>
                <Link
                  to={`/producto/${product.id}`}
                  className="product-image-area"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-real-image"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>

                <div className="product-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <Link to={`/producto/${product.id}`}>
                    <h3>{product.name}</h3>
                  </Link>

                  {product.size && <p>{product.size}</p>}

                  <span className={`product-stock ${stockInfo.className}`}>
                    {stockInfo.text}
                  </span>

                  <div className="product-bottom">
                    <strong>
                      {product.price !== null
                        ? `$${product.price.toLocaleString("es-AR")}`
                        : "Consultar"}
                    </strong>

                    <button
                      type="button"
                      className="add-cart-button"
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      aria-label={
                        product.stock <= 0
                          ? `${product.name} sin stock`
                          : `Agregar ${product.name} al carrito`
                      }
                    >
                      <i className="bi bi-cart3"></i>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
