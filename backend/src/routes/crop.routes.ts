import { Router } from "express";
import multer from "multer";
import { cropController } from "../controllers/crop.controller";

const router = Router();
const upload = multer();

router.post("/", upload.single("image"), cropController);

export default router;