import archiver from "archiver"
import sharp from "sharp"

export const processBulkImages = async (files: Express.Multer.File[]) => {
    const archive = archiver("zip", {
        zlib: { level: 9 }
    })

    for (const file of files) {
        const processedBuffer = await sharp(file.buffer)
            .jpeg({ quality: 70 })
            .toBuffer()

        const fileName =
            file.originalname.split(".")[0] + "-compressed.jpg"

        archive.append(processedBuffer, { name: fileName })
    }

    await archive.finalize()

    return archive
}