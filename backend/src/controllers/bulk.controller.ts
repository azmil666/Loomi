import { Request, Response } from "express"
import { processBulkImages } from "../services/bulk.service"

export const bulkProcess = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[]

        if (!files || files.length === 0) {
            return res.status(400).json({
                error: "No images uploaded"
            })
        }

        const archive = await processBulkImages(files)

        res.setHeader("Content-Type", "application/zip")
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=loomi-bulk-output.zip"
        )

        archive.pipe(res)

    } catch (error) {
        console.error("Bulk processing error:", error)

        res.status(500).json({
            error: "Bulk processing failed"
        })
    }
}