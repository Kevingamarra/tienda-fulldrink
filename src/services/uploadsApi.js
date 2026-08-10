import { API_BASE_URL } from "../config/api";
const API_URL = `${API_BASE_URL}/api/uploads`;

export async function uploadProductImage(file) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${API_URL}/image`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "No se pudo subir la imagen"
    );
  }

  return data.payload;
}
