import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createProduct,
  getAdminProducts,
  updateProduct,
  toggleProduct,
} from "../services/adminCatalogApi";
import ProductFormModal from "../components/admin/ProductFormModal";
import "./AdminProductsPage.css";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const loadProducts = async () => {
    try {
      setError("");

      const data = await getAdminProducts();

      setProducts(
        data.filter((item) => item.type === "product")
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    if (!cleanSearch) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = `
        ${product.name}
        ${product.category}
        ${product.frontendId}
        ${product.size || ""}
      `.toLowerCase();

      return searchableText.includes(cleanSearch);
    });
  }, [products, search]);

  const openNewProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    setMessage("");
    setError("");
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    setMessage("");
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleToggleProduct = async (product) => {
    try {
      setError("");
      setMessage("");

      await toggleProduct(product.frontendId);

      await loadProducts();

      setMessage(
        product.active
          ? product.name + " fue desactivado."
          : product.name + " fue activado."
      );
    } catch (err) {
      setError(err.message);
    }
  };


  const handleSaveProduct = async (productData) => {
    try {
      setSavingProduct(true);
      setError("");
      setMessage("");

      if (editingProduct) {
        await updateProduct(
          editingProduct.frontendId,
          productData
        );

        setMessage(
          `${productData.name} fue actualizado correctamente.`
        );
      } else {
        await createProduct(productData);

        setMessage(
          `${productData.name} fue creado correctamente.`
        );
      }

      await loadProducts();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <main className="admin-products-page">
      <div className="admin-products-container">
        <header className="admin-products-header">
          <div>
            <span>FULL DRINKS ADMIN</span>
            <h1>Productos</h1>
            <p>
              Administrá el catálogo de productos de la tienda.
            </p>
          </div>

          <div className="admin-products-header-actions">
            <Link
              to="/admin"
              className="admin-products-back"
            >
              <i className="bi bi-arrow-left"></i>
              DASHBOARD
            </Link>

            <button
              type="button"
              className="admin-new-product"
              onClick={openNewProduct}
            >
              <i className="bi bi-plus-lg"></i>
              NUEVO PRODUCTO
            </button>
          </div>
        </header>

        <div className="admin-products-toolbar">
          <div className="admin-products-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Buscar por nombre, categoría o ID..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="admin-products-count">
            {filteredProducts.length} productos
          </div>
        </div>

        {message && (
          <div className="admin-products-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-products-message error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-products-empty">
            Cargando productos...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-products-empty">
            <i className="bi bi-box-seam"></i>
            <h2>No encontramos productos</h2>
            <p>Probá cambiando la búsqueda.</p>
          </div>
        ) : (
          <div className="admin-products-grid">
            {filteredProducts.map((product) => (
              <article
                className="admin-product-card"
                key={product._id}
              >
                <div className="admin-product-top">
                  <div>
                    <span className="admin-product-category">
                      {product.category}
                    </span>

                    <h2>{product.name}</h2>

                    <p className="admin-product-id">
                      ID: {product.frontendId}
                    </p>
                  </div>

                  <span
                    className={`admin-product-status ${
                      product.active
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {product.active
                      ? "Activo"
                      : "Inactivo"}
                  </span>
                </div>

                <div className="admin-product-data">
                  <div>
                    <span>Precio</span>
                    <strong>
                      $
                      {product.price.toLocaleString(
                        "es-AR"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Stock</span>
                    <strong>{product.stock}</strong>
                  </div>

                  <div>
                    <span>Tamaño</span>
                    <strong>
                      {product.size || "Sin dato"}
                    </strong>
                  </div>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    className="admin-product-edit"
                    onClick={() =>
                      openEditProduct(product)
                    }
                  >
                    <i className="bi bi-pencil"></i>
                    EDITAR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleProduct(product)}
                    className={
                      product.active
                        ? "admin-product-disable"
                        : "admin-product-enable"
                    }
                  >
                    <i
                      className={`bi ${
                        product.active
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></i>

                    {product.active
                      ? "DESACTIVAR"
                      : "ACTIVAR"}
                  </button>

                  <button
                    type="button"
                    className="admin-product-delete"
                  >
                    <i className="bi bi-trash3"></i>
                    ELIMINAR
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ProductFormModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />

      {savingProduct && (
        <div className="admin-saving-overlay">
          Guardando producto...
        </div>
      )}
    </main>
  );
}

export default AdminProductsPage;
