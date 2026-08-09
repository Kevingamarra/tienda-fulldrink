const API_URL = "http://localhost:4001/api/products";

export async function getCatalogFromApi() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudo cargar el catálogo desde MongoDB");
  }

  const data = await response.json();

  return data.payload;
}
