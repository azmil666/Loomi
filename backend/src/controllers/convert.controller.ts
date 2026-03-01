import { Request, Response } from "express";
import { convertImage } from "../services/convert.service";

export const handleConvert = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const { format } = req.body;

        const convertedBuffer = await convertImage(
            req.file.buffer,
            format
        );

        res.set({
            "Content-Type": `image/${format}`,
            "Content-Disposition": `attachment; filename=converted.${format}`,
        });

        res.send(convertedBuffer);
    } catch (error: any) {
        if (error.message === "Invalid format selected") {
            res.status(400).json({ error: error.message });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Image conversion failed" });
    }
};