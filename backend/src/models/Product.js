import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    frontendId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    size: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["product", "combo"],
      default: "product",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
