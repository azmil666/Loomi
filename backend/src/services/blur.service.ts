import sharp from "sharp";

export const blurBrushService = async (imageBuffer: Buffer) => {
    const blurredImage = await sharp(imageBuffer)
        .blur(15)
        .png()
        .toBuffer();

    return blurredImage;
};