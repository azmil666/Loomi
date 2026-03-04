import { Router } from "express";
import { stripMetadataController } from "../controllers/stripMetadata.controller";
import upload from "../middleware/upload.middleware";

const router = Router();

router.post("/", upload.single("image"), stripMetadataController);

export default router;
