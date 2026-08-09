import { Router } from "express";
import {
  createOrder,
  getOrders,
  confirmOrder,
  cancelOrder,
} from "../controllers/orders.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

/* Público: el cliente crea su pedido */
router.post("/", createOrder);

/* Privado: solamente administrador */
router.get("/", adminAuth, getOrders);
router.patch("/:id/confirm", adminAuth, confirmOrder);
router.patch("/:id/cancel", adminAuth, cancelOrder);

export default router;
