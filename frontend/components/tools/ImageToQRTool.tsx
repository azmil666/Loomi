"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MorphingSquare } from "@/components/ui/morphing-square";
import ArrowNarrowLeftIcon from "@/components/ui/arrow-narrow-left-icon";
import { useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ImageToQRTool() {
    const [file, setFile] = useState<File | null>(null);
    const [qr, setQr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/avif",
    ];

    const handleFileChange = (newFiles: File[]) => {
        if (!newFiles.length) {
            setFile(null);
            setQr(null);
            return;
        }


const selected = newFiles[0];

if (!allowedTypes.includes(selected.type)) {
  toast.error("Invalid file type", {
    description: "Only PNG, JPEG, WEBP and AVIF images are supported.",
  });
  return;
}

setFile(selected);
setQr(null);


    };

    const handleGenerate = async () => {
        if (!file) return;


const formData = new FormData();
formData.append("image", file);

setLoading(true);

try {
  const res = await fetch(`${API_URL}/api/qr/image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    toast.error("QR generation failed", {
      description: "Please try again.",
    });
    return;
  }

  const data = await res.json();
  setQr(data.qr);

  toast.success("QR generated successfully!");
} catch (error) {
  toast.error("Server unavailable", {
    description: "Make sure the backend is running.",
  });
} finally {
  setLoading(false);
}


    };

    const downloadQR = () => {
        if (!qr) return;


const a = document.createElement("a");
a.href = qr;
a.download = "loomi-image-qr.png";
a.click();


    };

    return ( <main className="min-h-screen bg-neutral-950 text-neutral-50 py-35 px-6">


        {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6">
                    <MorphingSquare />
                    <p className="text-sm text-neutral-300 tracking-wide">
                        Generating QR...
                    </p>
                </div>
            </div>
        )}

        <div className="mx-auto w-full max-w-3xl">

            <header className="mb-12 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center justify-center w-10 h-10"
                >
                    <ArrowNarrowLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
                </button>

                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        Image → QR
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        Convert an image into a shareable QR code.
                    </p>
                </div>
            </header>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2 shadow-2xl">

                <div className="w-full bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
                    <FileUpload onChange={handleFileChange} />
                </div>

                {file && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border-t border-neutral-800 mt-2"
                    >
                        <p className="text-sm text-neutral-400">
                            Upload an image to generate a scannable QR code.
                        </p>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={cn(
                                "w-full sm:w-auto h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center",
                                "bg-white text-black hover:bg-neutral-200 active:scale-95",
                                "disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                            )}
                        >
                            Generate QR
                        </button>
                    </motion.div>
                )}

                {qr && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-6 p-8 border-t border-neutral-800"
                    >
                        <img
                            src={qr}
                            alt="QR Code"
                            className="w-56 h-56 border border-neutral-800 rounded-lg"
                        />

                        <button
                            onClick={downloadQR}
                            className="h-11 px-6 rounded-lg text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 transition"
                        >
                            Download QR
                        </button>
                    </motion.div>
                )}

            </div>
        </div>
    </main>


);
}
