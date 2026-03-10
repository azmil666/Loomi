import { Router } from "express";
import { generatePalette } from "../controllers/palette.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/", upload.single("image"), generatePalette);

export default router;