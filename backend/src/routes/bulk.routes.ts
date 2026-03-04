import { Router } from "express"
import multer from "multer"
import { bulkProcess } from "../controllers/bulk.controller"

const router = Router()

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
})

router.post(
    "/bulk",
    upload.array("images", 20),
    bulkProcess
)

export default router