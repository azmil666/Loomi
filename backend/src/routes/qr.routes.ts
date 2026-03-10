import express from "express";
import { imageToQR } from "../controllers/qr.controller";
import { upload } from "../middleware/upload.middleware";

const router = express.Router();

router.post("/image", upload.single("image"), imageToQR);

export default router;