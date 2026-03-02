import { Request, Response } from "express";
import { compressImage } from "../services/compress.service";

export const handleCompress = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const { format, quality } = req.body;

        const compressedBuffer = await compressImage(
            req.file.buffer,
            format,
            parseInt(quality)
        );

        res.set({
            "Content-Type": `image/${format}`,
            "Content-Disposition": `attachment; filename=compressed.${format}`,
        });

        res.send(compressedBuffer);
    } catch (error: any) {
        if (error.message === "Invalid format selected") {
            res.status(400).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Image compression failed" });
    }
};