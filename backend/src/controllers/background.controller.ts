import { Request, Response } from "express";
import { removeBg } from "../services/background.service";
import fs from "fs/promises";

export async function backgroundRemoveController(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const allowed = ["image/jpeg", "image/png", "image/webp"];

        if (!allowed.includes(req.file.mimetype)) {
            await fs.unlink(req.file.path);
            return res.status(400).json({ error: "Unsupported format" });
        }

        const output = await removeBg(req.file.path);

        await fs.unlink(req.file.path);

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", "attachment; filename=removed-bg.png");

        res.send(output);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Background removal failed" });
    }
}