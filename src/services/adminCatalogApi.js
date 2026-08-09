const API_URL = "http://localhost:4001/api/products";

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error");
  }

  return data.payload;
}

export function getAdminProducts() {
  return request(`${API_URL}/admin/all`);
}

export function createProduct(product) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
}

export function toggleProduct(id) {
  return request(`${API_URL}/${id}/toggle`, {
    method: "PATCH",
  });
}

export function deleteProduct(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
