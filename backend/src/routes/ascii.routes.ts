import express from "express";
import { asciiController } from "../controllers/ascii.controller";
import { upload } from "../middleware/upload.middleware";

const router = express.Router();

router.post("/", upload.single("image"), asciiController);

export default router;