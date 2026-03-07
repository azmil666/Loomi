import sharp from "sharp";

const ASCII_CHARS = "@%#*+=-:. ";

export async function imageToAscii(buffer: Buffer, width = 100) {
    const image = sharp(buffer).grayscale();

    const metadata = await image.metadata();

    const aspectRatio = (metadata.height || 1) / (metadata.width || 1);

    const height = Math.floor(width * aspectRatio * 0.55);

    const { data, info } = await image
        .resize(width, height)
        .raw()
        .toBuffer({ resolveWithObject: true });

    let ascii = "";

    for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
            const pixel = data[y * info.width + x];
            const charIndex = Math.floor((pixel / 255) * (ASCII_CHARS.length - 1));
            ascii += ASCII_CHARS[charIndex];
        }
        ascii += "\n";
    }

    return ascii;
}