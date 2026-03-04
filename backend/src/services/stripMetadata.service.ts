import sharp from "sharp";

export const stripMetadata = async (buffer: Buffer): Promise<Buffer> => {
    const output = await sharp(buffer)
        .toBuffer();

    return output;
};