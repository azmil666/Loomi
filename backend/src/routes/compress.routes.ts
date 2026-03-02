import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { handleCompress } from "../controllers/compress.controller";

const router = Router();

router.post("/", upload.single("image"), handleCompress);

export default router;