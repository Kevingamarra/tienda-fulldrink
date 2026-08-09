import { Router } from "express";
import {
  getProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  toggleProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

/* Públicas */
router.get("/", getProducts);

/* Admin */
router.get("/admin/all", adminAuth, getAdminProducts);
router.post("/", adminAuth, createProduct);
router.patch("/:id/toggle", adminAuth, toggleProduct);
router.patch("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

/* Pública por ID - siempre al final */
router.get("/:id", getProductById);

export default router;
