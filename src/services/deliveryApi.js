import { API_BASE_URL } from "../config/api";
const API_URL = `${API_BASE_URL}/api/delivery`;

export async function getDeliverySchedule(date, type) {
  const params = new URLSearchParams({
    date,
    type,
  });

  const response = await fetch(
    `${API_URL}/schedule?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "No se pudieron cargar los horarios"
    );
  }

  return data.payload;
}
