const API_URL = "http://localhost:4001/api/admin";

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
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
  return request(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getCurrentAdmin() {
  return request(`${API_URL}/current`);
}

export async function logoutAdmin() {
  return request(`${API_URL}/logout`, {
    method: "POST",
  });
}
