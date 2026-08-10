import { API_BASE_URL } from "../config/api";
import { getAdminAuthHeaders } from "../utils/adminToken";

const API_URL = `${API_BASE_URL}/api/products`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...getAdminAuthHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error"
    );
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
