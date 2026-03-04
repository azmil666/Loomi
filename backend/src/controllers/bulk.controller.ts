import { Request, Response } from "express"
import archiver from "archiver"

import { compressImage } from "../services/compress.service"
import { convertImage } from "../services/convert.service"
import { resizeImage } from "../services/resize.service"
import { stripMetadata } from "../services/stripMetadata.service"

export const bulkProcess = async (req: Request, res: Response) => {
    try {

        const files = req.files as Express.Multer.File[]
        const operation = (req.query.operation as string) || "compress"

        if (!files || files.length === 0) {
            return res.status(400).json({
                error: "No images uploaded"
            })
        }

        res.setHeader("Content-Type", "application/zip")
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=loomi-bulk-output.zip"
        )

        const archive = archiver("zip", {
            zlib: { level: 9 }
        })

        archive.on("error", (err) => {
            throw err
        })

        archive.pipe(res)

        for (const file of files) {

            let processedBuffer: Buffer
            let filename = file.originalname

            switch (operation) {

                case "compress":
                    processedBuffer = await compressImage(file.buffer)
                    filename = file.originalname
                    break

                case "resize":
                    processedBuffer = await resizeImage(file.buffer, 800)
                    filename = file.originalname
                    break

                case "convert":
                    processedBuffer = await convertImage(file.buffer, "png")
                    filename = file.originalname.split(".")[0] + ".png"
                    break

                case "stripMetadata":
                    processedBuffer = await stripMetadata(file.buffer)
                    filename = file.originalname
                    break

                default:
                    processedBuffer = file.buffer
            }

            archive.append(processedBuffer, { name: filename })
        }

        await archive.finalize()

    } catch (error) {

        console.error("Bulk processing error:", error)

        if (!res.headersSent) {
            res.status(500).json({
                error: "Bulk processing failed"
            })
        }
    }
}