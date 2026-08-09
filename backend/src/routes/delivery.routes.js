import { Router } from "express";
import { getSchedule } from "../controllers/delivery.controller.js";

const router = Router();

router.get("/schedule", getSchedule);

export default router;
