import DeliveryReservation from "../models/DeliveryReservation.js";
import {
  DELIVERY_SLOTS,
  PICKUP_SLOTS,
  isValidDeliveryDate,
} from "../utils/deliverySchedule.js";

export const getSchedule = async (req, res) => {
  try {
    const { date, type } = req.query;

    if (!isValidDeliveryDate(date)) {
      return res.status(400).json({
        status: "error",
        message: "Fecha inválida",
      });
    }

    if (!["envio", "retiro"].includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "Tipo inválido",
      });
    }

    if (type === "retiro") {
      return res.json({
        status: "success",
        payload: {
          date,
          slots: PICKUP_SLOTS.map((slot) => ({
            slot,
            available: true,
          })),
        },
      });
    }

    const reservations =
      await DeliveryReservation.find({
        deliveryDate: date,
      }).lean();

    const occupied = new Set(
      reservations.map((item) => item.deliverySlot)
    );

    res.json({
      status: "success",
      payload: {
        date,
        slots: DELIVERY_SLOTS.map((slot) => ({
          slot,
          available: !occupied.has(slot),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
