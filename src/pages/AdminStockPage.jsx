import { useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { updateProductAdmin } from "../services/adminProductsApi";
import "./AdminStockPage.css";

function AdminStockPage() {
  const {
    products,
    combos,
    refreshCatalog,
  } = useCatalog();

  const catalog = [...products, ...combos];

  const [stockValues, setStockValues] = useState({});
  const [priceValues, setPriceValues] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getStock = (item) =>
    stockValues[item.id] ?? item.stock;

  const getPrice = (item) =>
    priceValues[item.id] ?? item.price;

  const handleStockChange = (id, value) => {
    const parsed = Math.max(
      0,
      Number.parseInt(value || "0", 10)
    );

    setStockValues((current) => ({
      ...current,
      [id]: parsed,
    }));
  };

  const handlePriceChange = (id, value) => {
    const parsed = Math.max(
      0,
      Number(value || 0)
    );

    setPriceValues((current) => ({
      ...current,
      [id]: parsed,
    }));
  };

  const changeStockBy = (item, amount) => {
    handleStockChange(
      item.id,
      getStock(item) + amount
    );
  };

  const handleSave = async (item) => {
    try {
      setSavingId(item.id);
      setMessage("");
      setError("");

      await updateProductAdmin(
        item.id,
        {
          stock: getStock(item),
          price: getPrice(item),
        }
      );

      await refreshCatalog();

      setStockValues((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });

      setPriceValues((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });

      setMessage(
        `${item.name}: stock y precio actualizados correctamente.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="admin-stock-page">
      <div className="admin-stock-container">

        <header className="admin-stock-header">
          <div>
            <span>FULL DRINKS ADMIN</span>
            <h1>Stock y precios</h1>
          </div>

          <Link to="/admin">
            <i className="bi bi-arrow-left"></i>
            DASHBOARD
          </Link>
        </header>

        {message && (
          <div className="admin-stock-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-stock-message error">
            {error}
          </div>
        )}

        <div className="admin-stock-grid">
          {catalog.map((item) => {
            const stock = getStock(item);
            const price = getPrice(item);

            return (
              <article
                className="admin-stock-card"
                key={item.id}
              >
                <div className="admin-stock-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="admin-stock-info">
                  <span>{item.category}</span>

                  <h2>{item.name}</h2>

                  <div
                    className={`admin-stock-status ${
                      stock === 0
                        ? "out"
                        : stock <= 2
                        ? "low"
                        : "available"
                    }`}
                  >
                    {stock === 0
                      ? "Sin stock"
                      : stock <= 2
                      ? "Stock bajo"
                      : "Disponible"}
                  </div>

                  <label className="admin-product-label">
                    Precio
                  </label>

                  <div className="admin-price-control">
                    <span>$</span>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={price}
                      onChange={(event) =>
                        handlePriceChange(
                          item.id,
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <label className="admin-product-label">
                    Stock
                  </label>

                  <div className="admin-stock-controls">
                    <button
                      type="button"
                      onClick={() =>
                        changeStockBy(item, -1)
                      }
                      disabled={stock <= 0}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(event) =>
                        handleStockChange(
                          item.id,
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        changeStockBy(item, 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="admin-stock-save"
                    disabled={
                      savingId === item.id
                    }
                    onClick={() =>
                      handleSave(item)
                    }
                  >
                    {savingId === item.id
                      ? "GUARDANDO..."
                      : "GUARDAR CAMBIOS"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default AdminStockPage;
