import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import streamifier from "streamifier";
import { generateQRFromImageUrl } from "../services/qr.service";

export const imageToQR = async (req: Request, res: Response) => {
    try {

        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "loomi/qr-images" },
            async (error, result) => {

                if (error || !result) {
                    return res.status(500).json({ error: "Cloudinary upload failed" });
                }

                const imageUrl = result.secure_url;

                const qr = await generateQRFromImageUrl(imageUrl);

                res.json({
                    imageUrl,
                    qr: qr.qr
                });
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);

    } catch (error) {
        res.status(500).json({
            error: "QR generation failed"
        });
    }
};