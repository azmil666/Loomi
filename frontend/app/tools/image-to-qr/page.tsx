import ImageToQRTool from "@/components/tools/ImageToQRTool";

export default function Page() {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">
                Image to QR
            </h1>

            <ImageToQRTool />
        </div>
    );
}