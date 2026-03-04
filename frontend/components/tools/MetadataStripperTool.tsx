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

export default function MetadataStripperTool() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/avif",
        "image/gif",
        "image/tiff",
    ];

    const handleFileChange = (files: File[]) => {
        if (!files.length) {
            setFile(null);
            return;
        }

        const selected = files[0];

        if (!allowedTypes.includes(selected.type)) {
            toast.error("Invalid file type", {
                description: "Only PNG, JPEG, WEBP and AVIF files are allowed.",
            });
            return;
        }

        setFile(selected);
    };

    const handleProcess = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/strip-metadata`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                toast.error("Processing failed", {
                    description: "Please try again.",
                });
                setLoading(false);
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `loomi-clean`;
            a.click();

            toast.success("Metadata removed successfully!");

        } catch (err) {
            console.warn("Metadata stripping failed.");
            toast.error("Server unavailable", {
                description: "Please check if service is running.",
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
                            Removing metadata...
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
                            Metadata Stripper
                        </h1>
                        <p className="mt-2 text-neutral-400">
                            Remove EXIF, GPS, and device information from images.
                        </p>
                    </div>
                </header>

                {/* Tool Container */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2 shadow-2xl">

                    <div className="w-full bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
                        <FileUpload onChange={handleFileChange} />
                    </div>

                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-end p-8 border-t border-neutral-800 mt-2"
                        >
                            <button
                                onClick={handleProcess}
                                disabled={loading}
                                className={cn(
                                    "h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200",
                                    "bg-white text-black hover:bg-neutral-200 active:scale-95",
                                    "disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                                )}
                            >
                                Remove Metadata
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </main>
    );
}