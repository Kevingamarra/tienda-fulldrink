import mongoose from "mongoose";

const deliveryReservationSchema = new mongoose.Schema(
  {
    reservationKey: {
      type: String,
      required: true,
      unique: true,
    },

    deliveryDate: {
      type: String,
      required: true,
    },

    deliverySlot: {
      type: String,
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DeliveryReservation",
  deliveryReservationSchema
);
