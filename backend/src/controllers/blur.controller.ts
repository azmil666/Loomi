import { Request, Response } from "express";
import { blurBrushService } from "../services/blur.service";

export const blurBrushController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        if (!req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({ error: "File must be an image" });
        }

        const output = await blurBrushService(req.file.buffer);

        res.set("Content-Type", "image/png");
        res.send(output);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Blur processing failed" });
    }
};