"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload"; // Ensure this path matches your project
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState("webp");
    const [loading, setLoading] = useState(false);


    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/avif",
    ];

    const handleFileChange = (newFiles: File[]) => {
        if (!newFiles.length) return;

        const file = newFiles[0];

        if (!allowedTypes.includes(file.type)) {
            alert("Only PNG, JPEG, WEBP and AVIF files are allowed.");
            return;
        }

        setFiles([file]); // replace, don’t append
        onChange && onChange([file]);
    };

    const handleConvert = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("format", format);

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/convert", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                alert("Conversion failed");
                setLoading(false);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `loomi-converted.${format}`;
            a.click();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during conversion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-50 py-16 px-6">
            <div className="mx-auto w-full max-w-3xl">
                {/* Loomi Branding Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        Image Converter
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        High-performance internal tool for image format transformation.
                    </p>
                </header>

                {/* Main Tool Container */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2 shadow-2xl">
                    {/* Aceternity File Upload Component */}
                    <div className="w-full bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
                        <FileUpload onChange={handleFileChange} />
                    </div>

                    {/* Conversion Controls - Only visible when file is ready */}
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border-t border-neutral-800 mt-2"
                        >
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
                                </select>
                            </div>

                            <button
                                onClick={handleConvert}
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
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    "Convert & Download"
                                )}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}