import sharp from "sharp";

const allowedFormats = ["png", "jpeg", "webp", "avif"];

export const convertImage = async (
    buffer: Buffer,
    format: string
): Promise<Buffer> => {
    if (!allowedFormats.includes(format)) {
        throw new Error("Invalid format selected");
    }

    const converted = await sharp(buffer)
        .toFormat(format as keyof sharp.FormatEnum)
        .toBuffer();

    return converted;
};