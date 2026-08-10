const ADMIN_TOKEN_KEY = "fullDrinksAdminToken";

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token) {
  if (token) {
    sessionStorage.setItem(
      ADMIN_TOKEN_KEY,
      token
    );
  }
}

export function removeAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getAdminAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
