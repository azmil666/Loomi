import { Request, Response } from "express";
import { resizeImage } from "../services/resize.service";

export const resizeController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const width = req.body.width ? parseInt(req.body.width) : undefined;
        const height = req.body.height ? parseInt(req.body.height) : undefined;

        const resizedBuffer = await resizeImage(req.file.buffer, {
            width,
            height,
        });

        res.set("Content-Type", req.file.mimetype);
        return res.send(resizedBuffer);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};