import { Request, Response } from "express";
import { generateQRFromImageUrl } from "../services/qr.service";

export const imageToQR = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                error: "No image uploaded"
            });
        }

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

        const result = await generateQRFromImageUrl(imageUrl);

        res.json({
            imageUrl,
            qr: result.qr
        });

    } catch (error) {
        res.status(500).json({
            error: "QR generation failed"
        });
    }
};