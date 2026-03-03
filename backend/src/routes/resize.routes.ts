import { Router } from "express";
import { resizeController } from "../controllers/resize.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/", upload.single("file"), resizeController);

export default router;