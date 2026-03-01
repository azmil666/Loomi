import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { handleConvert } from "../controllers/convert.controller";

const router = Router();

router.post("/", upload.single("image"), handleConvert);

export default router;