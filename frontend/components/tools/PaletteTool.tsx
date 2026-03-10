"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MorphingSquare } from "@/components/ui/morphing-square";
import ArrowNarrowLeftIcon from "@/components/ui/arrow-narrow-left-icon";
import { useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaletteTool() {
    const [file, setFile] = useState<File | null>(null);
    const [palette, setPalette] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleFileChange = (newFiles: File[]) => {
        if (!newFiles.length) {
            setFile(null);
            setPalette([]);
            return;
        }

        const selected = newFiles[0];

        if (!selected.type.startsWith("image/")) {
            toast.error("Invalid file", {
                description: "Please upload a valid image file.",
            });
            return;
        }

        setFile(selected);
        setPalette([]);
    };

    const handleGenerate = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/palette`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.palette && Array.isArray(data.palette)) {
                setPalette(data.palette);
                toast.success("Palette generated!");
            } else {
                toast.error("Palette extraction failed");
            }
        } catch (err) {
            toast.error("Server unavailable");
        } finally {
            setLoading(false);
        }
    };

    const copyColor = (color: string) => {
        navigator.clipboard.writeText(color);
        toast.success(`${color} copied`);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-50 py-35 px-6">

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6">
                        <MorphingSquare />
                        <p className="text-sm text-neutral-300 tracking-wide">
                            Extracting colors...
                        </p>
                    </div>
                </div>
            )}

            <div className="mx-auto w-full max-w-3xl">

                {/* Header */}
                <header className="mb-12 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center justify-center w-10 h-10"
                    >
                        <ArrowNarrowLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
                    </button>

                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter text-white">
                            Color Palette Generator
                        </h1>
                        <p className="mt-2 text-neutral-400">
                            Extract dominant colors from an image.
                        </p>
                    </div>
                </header>

                {/* Tool container */}
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
                                onClick={handleGenerate}
                                className="h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center bg-white text-black hover:bg-neutral-200 active:scale-95"
                            >
                                Generate Palette
                            </button>
                        </motion.div>
                    )}

                    {/* Palette result */}
                    {palette.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 border-t border-neutral-800"
                        >
                            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
                                Extracted Colors
                            </p>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">

                                {palette.map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => copyColor(color)}
                                        className="cursor-pointer group"
                                    >
                                        <div
                                            className="h-20 rounded-lg border border-neutral-700 shadow-md transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: color }}
                                        />

                                        <p className="text-xs text-center mt-2 text-neutral-300 group-hover:text-white">
                                            {color}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </main>
    );
}