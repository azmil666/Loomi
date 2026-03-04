import { Request, Response } from "express"

export const bulkProcess = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[]

        if (!files || files.length === 0) {
            return res.status(400).json({
                error: "No images uploaded"
            })
        }

        return res.json({
            message: "Bulk endpoint working",
            filesReceived: files.length
        })

    } catch (error) {
        console.error("Bulk processing error:", error)

        return res.status(500).json({
            error: "Bulk processing failed"
        })
    }
}