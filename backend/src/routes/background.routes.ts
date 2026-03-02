import { Router } from "express";
import upload from "../middleware/upload.middleware";
import { backgroundRemoveController } from "../controllers/background.controller";

const router = Router();

router.post("/", upload.single("image"), backgroundRemoveController);

export default router;