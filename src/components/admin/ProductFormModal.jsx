import { useEffect, useState } from "react";
import { uploadProductImage } from "../../services/uploadsApi";

const EMPTY_PRODUCT = {
  name: "",
  category: "gin",
  price: "",
  stock: "",
  size: "",
  image: "",
};

function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        stock: initialData.stock,
        size: initialData.size || "",
        image: initialData.image || "",
      });

      setPreviewUrl(initialData.image || "");
    } else {
      setForm(EMPTY_PRODUCT);
      setPreviewUrl("");
    }

    setSelectedFile(null);
    setUploadError("");
  }, [initialData, open]);

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!open) return null;

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Solo se permiten imágenes JPG, PNG o WebP."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(
        "La imagen no puede superar los 5 MB."
      );
      return;
    }

    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setUploading(true);
      setUploadError("");

      let imageUrl = form.image;

      if (selectedFile) {
        const uploaded =
          await uploadProductImage(selectedFile);

        imageUrl = uploaded.url;
      }

      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageUrl,
      });
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2>
          {initialData
            ? "Editar producto"
            : "Nuevo producto"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Categoría"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            min="0"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <input
            name="size"
            placeholder="Tamaño"
            value={form.size}
            onChange={handleChange}
          />

          <div className="admin-image-field">
            <span className="admin-image-label">
              Imagen del producto
            </span>

            <label className="admin-image-picker">
              <i className="bi bi-image"></i>

              <span>
                {selectedFile
                  ? selectedFile.name
                  : "Seleccionar imagen"}
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </label>

            {previewUrl && (
              <div className="admin-image-preview">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                />
              </div>
            )}

            {uploadError && (
              <div className="admin-image-error">
                {uploadError}
              </div>
            )}
          </div>

          <div className="admin-modal-buttons">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? "SUBIENDO..."
                : initialData
                ? "Guardar cambios"
                : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
