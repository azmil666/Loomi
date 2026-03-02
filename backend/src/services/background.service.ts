import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs/promises";

export async function removeBg(filePath: string): Promise<Buffer> {
    const imageBuffer = await fs.readFile(filePath);

    const outputBuffer = await removeBackground(imageBuffer, {
        model: "medium",
    });

    return Buffer.from(outputBuffer);
}