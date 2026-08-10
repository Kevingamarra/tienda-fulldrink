import { API_BASE_URL } from "../config/api";
const API_URL = `${API_BASE_URL}/api/products`;

export async function getCatalogFromApi() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudo cargar el catálogo desde MongoDB");
  }

  const data = await response.json();

  return data.payload;
}
