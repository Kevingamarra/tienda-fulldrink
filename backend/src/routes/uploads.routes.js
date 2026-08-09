import { Router } from "express";
import { uploadImage } from "../controllers/uploads.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post(
  "/image",
  adminAuth,
  upload.single("image"),
  uploadImage
);

export default router;
