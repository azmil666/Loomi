import sharp from "sharp";

export interface ResizeOptions {
    width?: number;
    height?: number;
}

export const resizeImage = async (
    buffer: Buffer,
    options: ResizeOptions
): Promise<Buffer> => {
    const { width, height } = options;

    if (!width && !height) {
        throw new Error("At least width or height must be provided");
    }

    const resizedBuffer = await sharp(buffer)
        .resize(width, height, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .toBuffer();

    return resizedBuffer;
};