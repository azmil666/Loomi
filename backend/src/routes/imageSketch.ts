import express from "express";
import multer from "multer";
import sharp from "sharp";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/sketch", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const input = req.file.buffer;

    // 1️⃣ Convert to grayscale
    const gray = await sharp(input)
      .grayscale()
      .toBuffer();

    // 2️⃣ Create blurred version
    const blurred = await sharp(gray)
      .blur(12)
      .toBuffer();

    // 3️⃣ Invert blurred image
    const inverted = await sharp(blurred)
      .negate()
      .toBuffer();

    // 4️⃣ Blend using color-dodge style effect
    const sketch = await sharp(gray)
      .composite([
        {
          input: inverted,
          blend: "color-dodge",
        },
      ])
      .normalize()
      .sharpen()
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(sketch);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sketch generation failed" });
  }
});

export default router;