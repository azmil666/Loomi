"use client";

import { useRef, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MorphingSquare } from "@/components/ui/morphing-square";
import ArrowNarrowLeftIcon from "@/components/ui/arrow-narrow-left-icon";
import { useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlurPage() {

    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);

    const handleFileChange = (files: File[]) => {

        if (!files.length) {
            setFile(null);
            setPreview(null);
            return;
        }

        const selected = files[0];

        if (!selected.type.startsWith("image/")) {
            toast.error("Invalid file", {
                description: "Only image files are supported."
            });
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setResult(null);
    };

    const startDraw = () => {
        drawing.current = true;
    };

    const stopDraw = () => {
        drawing.current = false;
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {

        if (!drawing.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
    };

    const clearMask = () => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const applyBlur = async () => {

        if (!file || !canvasRef.current) return;

        const canvas = canvasRef.current;

        const maskBlob: Blob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob!), "image/png")
        );

        const formData = new FormData();
        formData.append("image", file);
        formData.append("mask", maskBlob, "mask.png");

        setLoading(true);

        try {

            const res = await fetch(`${API_URL}/api/blur`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                toast.error("Blur failed");
                setLoading(false);
                return;
            }

            const blob = await res.blob();
            setResult(URL.createObjectURL(blob));

            toast.success("Blur applied");

        } catch {
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
                            Processing blur...
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
                            Blur Brush
                        </h1>
                        <p className="mt-2 text-neutral-400">
                            Selectively blur regions of an image using a brush tool.
                        </p>
                    </div>

                </header>

                {/* Tool Container */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2 shadow-2xl">

                    <div className="w-full bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
                        <FileUpload onChange={handleFileChange} />
                    </div>

                    {preview && (

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 border-t border-neutral-800 mt-2 space-y-6"
                        >

                            <div className="relative inline-block">

                                <img
                                    src={preview}
                                    className="rounded max-w-full"
                                    onLoad={(e) => {

                                        const img = e.currentTarget;

                                        const canvas = canvasRef.current;
                                        if (!canvas) return;

                                        canvas.width = img.naturalWidth;
                                        canvas.height = img.naturalHeight;

                                        canvas.style.width = img.width + "px";
                                        canvas.style.height = img.height + "px";

                                        const ctx = canvas.getContext("2d");
                                        if (!ctx) return;

                                        ctx.fillStyle = "black";
                                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                                    }}
                                />

                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-0 left-0 cursor-crosshair opacity-50"
                                    onMouseDown={startDraw}
                                    onMouseUp={stopDraw}
                                    onMouseLeave={stopDraw}
                                    onMouseMove={draw}
                                />

                            </div>

                            <div className="flex gap-4">

                                <button
                                    onClick={clearMask}
                                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                                >
                                    Clear Mask
                                </button>

                                <button
                                    onClick={applyBlur}
                                    className={cn(
                                        "px-8 py-2 rounded-lg font-semibold",
                                        "bg-white text-black hover:bg-neutral-200"
                                    )}
                                >
                                    Apply Blur
                                </button>

                            </div>

                            {result && (
                                <div className="pt-6 border-t border-neutral-800 space-y-4">

                                    <h3 className="text-sm uppercase tracking-widest text-neutral-500">
                                        Result
                                    </h3>

                                    <img
                                        src={result}
                                        className="rounded-lg max-w-lg"
                                    />

                                    <button
                                        onClick={() => {
                                            const a = document.createElement("a");
                                            a.href = result;
                                            a.download = "loomi-blurred.png";
                                            a.click();
                                        }}
                                        className="px-6 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold"
                                    >
                                        Download Image
                                    </button>

                                </div>
                            )}

                        </motion.div>

                    )}

                </div>

            </div>
        </main>
    );
}