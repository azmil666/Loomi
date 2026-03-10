import { Request, Response } from "express";
import { extractPalette } from "../services/palette.service";

export const generatePalette = async (req: Request, res: Response) => {
    try {

        console.log("file received:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const palette = await extractPalette(req.file.buffer);

        console.log("palette:", palette);

        res.json({ palette });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Palette generation failed" });
    }
};