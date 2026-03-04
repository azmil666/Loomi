import sharp from "sharp";

export async function cropImage(
    buffer: Buffer,
    x: number,
    y: number,
    width: number,
    height: number
) {
    const cropped = await sharp(buffer)
        .extract({
            left: Math.round(x),
            top: Math.round(y),
            width: Math.round(width),
            height: Math.round(height),
        })
        .toBuffer();

    return cropped;
}