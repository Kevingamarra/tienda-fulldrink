import { API_BASE_URL } from "../config/api";
const API_URL = `${API_BASE_URL}/api/orders`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ocurrió un error con el pedido"
    );
  }

  return data.payload;
}

export async function createPendingOrder(orderData) {
  return request(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
}

export async function getOrders() {
  return request(API_URL);
}

export async function confirmOrder(orderId) {
  return request(
    `${API_URL}/${orderId}/confirm`,
    {
      method: "PATCH",
    }
  );
}

export async function cancelOrder(orderId) {
  return request(
    `${API_URL}/${orderId}/cancel`,
    {
      method: "PATCH",
    }
  );
}
