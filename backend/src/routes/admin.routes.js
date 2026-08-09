import { Router } from "express";
import {
  loginAdmin,
  currentAdmin,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/current", adminAuth, currentAdmin);
router.post("/logout", adminAuth, logoutAdmin);

export default router;
