import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
app.use(cors());
app.get("/", (req: Request, res: Response) => {
    res.send("Server is working 🚀");
});

// Multer config (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

app.post(
    "/convert",
    upload.single("image"),
    async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            const { format } = req.body;

            const allowedFormats = ["png", "jpeg", "webp", "avif"];

            if (!allowedFormats.includes(format)) {
                res.status(400).json({ error: "Invalid format selected" });
                return;
            }

            const convertedBuffer = await sharp(req.file.buffer)
                .toFormat(format as keyof sharp.FormatEnum)
                .toBuffer();

            res.set({
                "Content-Type": `image/${format}`,
                "Content-Disposition": `attachment; filename=converted.${format}`,
            });

            res.send(convertedBuffer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Image conversion failed" });
        }
    }
);

app.get("/test", async (req: Request, res: Response) => {
    const buffer = await sharp({
        create: {
            width: 200,
            height: 200,
            channels: 3,
            background: { r: 255, g: 0, b: 0 },
        },
    })
        .png()
        .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(buffer);
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});