import { API_BASE_URL } from "../config/api";
const API_URL = `${API_BASE_URL}/api/products`;

export async function updateProductAdmin(productId, updates) {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "No se pudo actualizar el producto"
    );
  }

  return data.payload;
}
