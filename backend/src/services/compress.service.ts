import sharp from "sharp";

const allowedFormats = [
    "png",
    "jpeg",
    "webp",
    "avif",
    "gif",
    "tiff",
];

export const compressImage = async (
    buffer: Buffer,
    format: string,
    quality: number
): Promise<Buffer> => {
    if (!allowedFormats.includes(format)) {
        throw new Error("Invalid format selected");
    }

    const q = quality >= 1 && quality <= 100 ? quality : 80;

    let image = sharp(buffer);

    switch (format) {
        case "png":
            image = image.png({ quality: q });
            break;

        case "jpeg":
            image = image.jpeg({ quality: q });
            break;

        case "webp":
            image = image.webp({ quality: q });
            break;

        case "avif":
            image = image.avif({ quality: q });
            break;

        case "tiff":
            image = image.tiff({ quality: q });
            break;

        case "gif":
            image = image.gif();
            break;

        default:
            throw new Error("Invalid format selected");
    }

    return await image.toBuffer();
};