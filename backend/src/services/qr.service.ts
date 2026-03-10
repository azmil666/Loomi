import QRCode from "qrcode";

export const generateQRFromImageUrl = async (imageUrl: string) => {
    try {
        const qrDataUrl = await QRCode.toDataURL(imageUrl);

        return {
            success: true,
            qr: qrDataUrl
        };
    } catch (error) {
        throw new Error("QR generation failed");
    }
};