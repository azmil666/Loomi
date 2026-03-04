import { Request, Response } from "express";
import { stripMetadata } from "../services/stripMetadata.service";

export const stripMetadataController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const processedImage = await stripMetadata(req.file.buffer);

        res.set("Content-Type", req.file.mimetype);
        res.send(processedImage);

    } catch (error) {
        console.error("Metadata strip error:", error);
        res.status(500).json({ error: "Failed to strip metadata" });
    }
};