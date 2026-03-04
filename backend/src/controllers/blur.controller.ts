import { Request, Response } from "express";
import { blurBrushService } from "../services/blur.service";

export const blurBrushController = async (req: Request, res: Response) => {
    try {
        const image = req.file;

        if (!image) {
            return res.status(400).json({ error: "Image is required" });
        }

        const result = await blurBrushService(image.buffer);

        res.set("Content-Type", "image/png");
        res.send(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Blur brush processing failed" });
    }
};