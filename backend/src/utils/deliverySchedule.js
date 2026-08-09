export const DELIVERY_SLOTS = [
  "18:00 - 18:30",
  "18:30 - 19:00",
  "19:00 - 19:30",
  "19:30 - 20:00",
  "20:00 - 20:30",
  "20:30 - 21:00",
  "21:00 - 21:30",
  "21:30 - 22:00",
  "22:00 - 22:30",
  "22:30 - 23:00",
  "23:00 - 23:30",
  "23:30 - 00:00",
];

export const PICKUP_SLOTS = [
  "20:00 - 00:00",
  "00:00 - 03:00",
];

export function isValidDeliveryDate(dateString) {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return false;
  }

  const date = new Date(`${dateString}T12:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const day = date.getUTCDay();

  return day === 5 || day === 6;
}

export function isValidSlot(deliveryType, slot) {
  if (deliveryType === "envio") {
    return DELIVERY_SLOTS.includes(slot);
  }

  if (deliveryType === "retiro") {
    return PICKUP_SLOTS.includes(slot);
  }

  return false;
}

export function getReservationKey(date, slot) {
  return `${date}|${slot}`;
}
