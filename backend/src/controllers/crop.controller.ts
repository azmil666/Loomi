import { Request, Response } from "express";
import { cropImage } from "../services/crop.service";

export const cropController = async (req: Request, res: Response) => {
    try {
        const { x, y, width, height } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const cropped = await cropImage(
            req.file.buffer,
            Number(x),
            Number(y),
            Number(width),
            Number(height)
        );

        res.set("Content-Type", "image/png");
        res.send(cropped);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cropping failed" });
    }
};