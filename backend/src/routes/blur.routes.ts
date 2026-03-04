import express from "express";
import { upload } from "../middleware/upload.middleware";
import { blurBrushController } from "../controllers/blur.controller";

const router = express.Router();

router.post("/", upload.single("image"), blurBrushController);

export default router;