import getColors from "get-image-colors";
import sharp from "sharp";

export const extractPalette = async (buffer: Buffer) => {


    const processed = await sharp(buffer)
        .resize(200)
        .png()
        .toBuffer();

    const colors = await getColors(processed, "image/png");

    const palette = colors.slice(0, 6).map((color: any) => color.hex());

    return palette;
};