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

export default function ResizerTool() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [loading, setLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [resizedSize, setResizedSize] = useState<number | null>(null);

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/avif",
        "image/gif",
        "image/tiff",
    ];

    const handleFileChange = (newFiles: File[]) => {
        if (!newFiles.length) {
            setFile(null);
            setOriginalSize(null);
            setResizedSize(null);
            return;
        }

        const selected = newFiles[0];

        if (!allowedTypes.includes(selected.type)) {
            toast.error("Invalid file type", {
                description: "Only PNG, JPEG, WEBP and AVIF files are allowed.",
            });
            return;
        }

        setFile(selected);
        setOriginalSize(selected.size);
        setResizedSize(null);
    };

    const handleResize = async () => {
        if (!file) return;

        if (!width && !height) {
            toast.warning("Width or height required", {
                description: "Please provide at least one dimension.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        if (width) formData.append("width", width);
        if (height) formData.append("height", height);

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/resize`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                toast.error("Resize failed", {
                    description: "Please try again.",
                });
                setLoading(false);
                return;
            }

            const blob = await response.blob();
            setResizedSize(blob.size);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "loomi-resized.png";
            a.click();

            toast.success("Resize successful!");
        } catch (error) {
            toast.error("Server unavailable", {
                description: "Please check backend service.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-50 py-35 px-6">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6">
                        <MorphingSquare />
                        <p className="text-sm text-neutral-300 tracking-wide">
                            Resizing image...
                        </p>
                    </div>
                </div>
            )}

            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-12 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center justify-center w-10 h-10 transition-all duration-200"
                    >
                        <ArrowNarrowLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
                    </button>

                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter text-white">
                            Image Resizer
                        </h1>
                        <p className="mt-2 text-neutral-400">
                            High-performance internal tool for controlled image resizing.
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
                            className="flex flex-col gap-6 p-8 border-t border-neutral-800 mt-2"
                        >
                            <div className="flex flex-col sm:flex-row gap-6">
                                <input
                                    type="number"
                                    placeholder="Width (px)"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    className="bg-neutral-900 border border-neutral-800 text-sm rounded-lg px-4 py-2.5 text-neutral-200 outline-none"
                                />

                                <input
                                    type="number"
                                    placeholder="Height (px)"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="bg-neutral-900 border border-neutral-800 text-sm rounded-lg px-4 py-2.5 text-neutral-200 outline-none"
                                />
                            </div>

                            <button
                                onClick={handleResize}
                                disabled={loading}
                                className={cn(
                                    "h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center",
                                    "bg-white text-black hover:bg-neutral-200 active:scale-95",
                                    "disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                                )}
                            >
                                Resize & Download
                            </button>
                        </motion.div>
                    )}

                    {originalSize && (
                        <div className="px-8 pb-6 text-sm text-neutral-400 space-y-1">
                            <p>
                                Original Size:{" "}
                                <span className="text-neutral-200 font-medium">
                  {formatBytes(originalSize)}
                </span>
                            </p>

                            {resizedSize && (
                                <>
                                    <p>
                                        Resized Size:{" "}
                                        <span className="text-neutral-200 font-medium">
                      {formatBytes(resizedSize)}
                    </span>
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}