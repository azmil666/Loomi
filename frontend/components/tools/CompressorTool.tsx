"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MorphingSquare } from "@/components/ui/morphing-square";
import  ArrowNarrowLeftIcon  from "@/components/ui/arrow-narrow-left-icon";
import { useRouter } from "next/navigation";
const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CompressorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState("webp");
    const [quality, setQuality] = useState(80);
    const [loading, setLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [compressedSize, setCompressedSize] = useState<number | null>(null);
    const router = useRouter();

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleFileChange = (files: File[]) => {
        if (!files.length) {
            setFile(null);
            setOriginalSize(null);
            setCompressedSize(null);
            return;
        }

        const selected = files[0];
        setFile(selected);
        setOriginalSize(selected.size);
        setCompressedSize(null);
    };

    const handleCompress = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("format", format);
        formData.append("quality", quality.toString());

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/compress`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                toast.error("Compression failed");
                setLoading(false);
                return;
            }

            const blob = await response.blob();
            setCompressedSize(blob.size);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `loomi-compressed.${format}`;
            a.click();

            toast.success("Compression successful!");
        } catch (err) {
            toast.error("Server unavailable");
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
                            Compressing image...
                        </p>
                    </div>
                </div>
            )}
            <div className="mx-auto w-full max-w-3xl">

                {/* Header */}
                <header className="mb-12 flex items-center gap-4">
                    <button
                        onClick={() => router.push("/tools")}
                        className="group flex items-center justify-center w-10 h-10  transition-all duration-200"
                    >
                        <ArrowNarrowLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
                    </button>

                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter text-white">
                            Image Compressor
                        </h1>
                        <p className="mt-2 text-neutral-400">
                            Reduce image file size while preserving visual quality.
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
                            {/* Format + Quality Row */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                                <div className="flex flex-col w-full sm:w-auto">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2">
                                        Target Format
                                    </label>
                                    <select
                                        className="bg-neutral-900 border border-neutral-800 text-sm rounded-lg px-4 py-2.5 text-neutral-200 focus:ring-1 focus:ring-neutral-700 outline-none transition-all duration-200"
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                    >
                                        <option value="webp">WEBP</option>
                                        <option value="png">PNG</option>
                                        <option value="jpeg">JPEG</option>
                                        <option value="avif">AVIF</option>
                                        <option value="tiff">TIFF</option>
                                        <option value="gif">GIF</option>
                                    </select>
                                </div>

                                <div className="flex flex-col w-full sm:w-auto">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2">
                                        Quality: {quality}
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                        className="w-full accent-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Button */}
                            <button
                                onClick={handleCompress}
                                disabled={loading}
                                className={cn(
                                    "w-full sm:w-auto h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center",
                                    "bg-white text-black hover:bg-neutral-200 active:scale-95",
                                    "disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                                )}
                            >
                                Compress & Download
                            </button>
                        </motion.div>
                    )}

                    {/* Size Display */}
                    {originalSize && (
                        <div className="px-8 pb-6 text-sm text-neutral-400 space-y-1">
                            <p>
                                Original Size:{" "}
                                <span className="text-neutral-200 font-medium">
                                    {formatBytes(originalSize)}
                                  </span>
                            </p>

                            {compressedSize && originalSize && (
                                <>
                                    <p>
                                        Compressed Size:{" "}
                                        <span className="text-neutral-200 font-medium">
                                        {formatBytes(compressedSize)}
                                      </span>
                                    </p>

                                    {compressedSize < originalSize ? (
                                        <p>
                                            Saved:{" "}
                                            <span className="text-green-400 font-medium">
                                              {(
                                                  ((originalSize - compressedSize) / originalSize) *
                                                  100
                                              ).toFixed(1)}
                                                                                %
                                            </span>
                                        </p>
                                    ) : (
                                        <p>
                                            Increased by:{" "}
                                            <span className="text-red-400 font-medium">
                                              {(
                                                  ((compressedSize - originalSize) / originalSize) *
                                                  100
                                              ).toFixed(1)}
                                                                                %
                                            </span>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}