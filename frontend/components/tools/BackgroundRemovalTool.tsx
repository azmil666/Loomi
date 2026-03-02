"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BackgroundRemovalTool() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
    ];

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleFileChange = (newFiles: File[]) => {
        if (!newFiles.length) {
            setFile(null);
            setOriginalSize(null);
            setResultUrl(null);
            return;
        }

        const selected = newFiles[0];

        if (!allowedTypes.includes(selected.type)) {
            toast.error("Invalid file type", {
                description: "Only PNG, JPEG and WEBP files are allowed.",
            });
            return;
        }

        setFile(selected);
        setOriginalSize(selected.size);
        setResultUrl(null);
    };

    const handleRemoveBackground = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/background-remove`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                toast.error("Processing failed", {
                    description: "Please try again.",
                });
                setLoading(false);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            setResultUrl(url);

            toast.success("Background removed successfully!");
        } catch (error) {
            toast.error("Server unavailable", {
                description: "Check if backend is running.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-50 py-35 px-6">
            <div className="mx-auto w-full max-w-3xl">

                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        Background Removal
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        AI-powered background removal with transparent PNG output.
                    </p>
                </header>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2 shadow-2xl">

                    <div className="w-full bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
                        <FileUpload onChange={handleFileChange} />
                    </div>

                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-6 p-8 border-t border-neutral-800 mt-2"
                        >
                            <button
                                onClick={handleRemoveBackground}
                                disabled={loading}
                                className={cn(
                                    "w-full sm:w-auto h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center",
                                    "bg-white text-black hover:bg-neutral-200 active:scale-95",
                                    "disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                                )}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-neutral-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                                ) : (
                                    "Remove Background"
                                )}
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
                        </div>
                    )}

                    {resultUrl && (
                        <div className="px-8 pb-8 flex flex-col items-center gap-6">
                            <div className="border border-neutral-800 rounded-xl overflow-hidden">
                                <img
                                    src={resultUrl}
                                    alt="Background removed"
                                    className="max-h-[400px] object-contain"
                                />
                            </div>

                            <a
                                href={resultUrl}
                                download="loomi-background-removed.png"
                                className="bg-white text-black px-8 py-2 rounded-lg font-bold text-sm hover:bg-neutral-200 transition"
                            >
                                Download PNG
                            </a>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}