"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MorphingSquare } from "@/components/ui/morphing-square";
import { Copy } from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AsciiTool() {
    const [file, setFile] = useState<File | null>(null);
    const [ascii, setAscii] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (files: File[]) => {
        if (!files.length) {
            setFile(null);
            setAscii("");
            return;
        }

        setFile(files[0]);
        setAscii("");
    };

    const handleConvert = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/ascii`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                toast.error("ASCII conversion failed");
                setLoading(false);
                return;
            }

            const data = await res.json();

            setAscii(data.ascii);

            toast.success("ASCII generated successfully");
        } catch {
            toast.error("Server unavailable", {
                description: "Check if backend service is running.",
            });
        } finally {
            setLoading(false);
        }
    };

    const copyAscii = async () => {
        if (!ascii) return;

        await navigator.clipboard.writeText(ascii);

        toast.success("ASCII copied to clipboard");
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-50 py-35 px-6">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6">
                        <MorphingSquare />
                        <p className="text-sm text-neutral-300 tracking-wide">
                            Generating ASCII...
                        </p>
                    </div>
                </div>
            )}

            <div className="mx-auto w-full max-w-4xl">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        Image → ASCII
                    </h1>
                    <p className="mt-2 text-neutral-400">
                        Convert images into ASCII art.
                    </p>
                </header>

                {/* Tool container */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2 shadow-2xl">

                    {/* Upload */}
                    <div className="w-full bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
                        <FileUpload onChange={handleFileChange} />
                    </div>

                    {/* Convert button */}
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end p-8 border-t border-neutral-800 mt-2"
                        >
                            <button
                                onClick={handleConvert}
                                disabled={loading}
                                className="h-12 px-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center bg-white text-black hover:bg-neutral-200 active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                            >
                                Generate ASCII
                            </button>
                        </motion.div>
                    )}

                    {/* ASCII Result */}
                    {ascii && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative border-t border-neutral-800"
                        >
                            {/* Copy button */}
                            <button
                                onClick={copyAscii}
                                className="absolute top-4 right-4 flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
                            >
                                <Copy className="w-4 h-4" />
                                Copy
                            </button>

                            <div className="p-8 overflow-x-auto">
               <pre
                   className="whitespace-pre text-white"
                   style={{
                       fontFamily: "monospace",
                       fontSize: "8px",
                       lineHeight: "8px",
                       letterSpacing: "0.5px"
                       }}
                   >
                      {ascii}
                    </pre>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}