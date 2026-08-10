import { API_BASE_URL } from "../config/api";
import {
  getAdminAuthHeaders,
  removeAdminToken,
  saveAdminToken,
} from "../utils/adminToken";

const API_URL = `${API_BASE_URL}/api/admin`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
      ...getAdminAuthHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error de autenticación"
    );
  }

  return data.payload;
}

export async function loginAdmin(email, password) {
  const payload = await request(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  saveAdminToken(payload.token);

  return {
    email: payload.email,
    role: payload.role,
  };
}

export async function getCurrentAdmin() {
  return request(`${API_URL}/current`);
}

export async function logoutAdmin() {
  try {
    await request(`${API_URL}/logout`, {
      method: "POST",
    });
  } finally {
    removeAdminToken();
  }
}
