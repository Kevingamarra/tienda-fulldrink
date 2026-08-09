import { useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import "../components/home/FeaturedProducts.css";
import "./ProductsPage.css";

function ProductsPage() {
  const [category, setCategory] =
    useState("todos");

  const { products } = useCatalog();

  const filteredProducts =
    category === "todos"
      ? products
      : products.filter(
          (product) =>
            product.category === category
        );

  const categories = [
    "todos",
    "gin",
    "vodka",
    "whisky",
    "espumantes",
  ];

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
    <main className="products-page">
      <section className="featured-container">
        <div className="featured-header">
          <div>
            <h2>TODOS LOS PRODUCTOS</h2>
            <span className="featured-line"></span>
          </div>
        </div>

        <div className="products-filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setCategory(item)
              }
              className={`products-filter-button ${
                category === item
                  ? "active"
                  : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="featured-grid">
          {filteredProducts.map(
            (product) => {
              const stockInfo =
                getStockInfo(product.stock);

              return (
                <article
                  className="product-card"
                  key={product.id}
                >
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

                    <Link
                      to={`/producto/${product.id}`}
                    >
                      <h3>{product.name}</h3>
                    </Link>

                    {product.size && (
                      <p>{product.size}</p>
                    )}

                    <span
                      className={`product-stock ${stockInfo.className}`}
                    >
                      {stockInfo.text}
                    </span>

                    <div className="product-bottom">
                      <strong>
                        $
                        {product.price.toLocaleString(
                          "es-AR"
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductsPage;
