const API_URL = "http://localhost:4001/api/delivery";

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
