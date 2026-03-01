"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState("webp");
    const [loading, setLoading] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        multiple: false,
        onDrop,
    });

    const handleConvert = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("format", format);

        setLoading(true);

        const response = await fetch("http://localhost:5000/convert", {
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
        a.download = `converted.${format}`;
        a.click();

        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-8">Loom Image Converter</h1>

            <div
                {...getRootProps()}
                className={`w-full max-w-md border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition
        ${isDragActive ? "border-blue-500 bg-gray-800" : "border-gray-600"}`}
            >
                <input {...getInputProps()} />
                {file ? (
                    <p className="text-green-400">{file.name}</p>
                ) : (
                    <p>Drag & Drop an image here</p>
                )}
            </div>

            {file && (
                <>
                    <select
                        className="mt-6 p-2 bg-gray-800 rounded"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        <option value="webp">WebP</option>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="avif">AVIF</option>
                    </select>

                    <button
                        onClick={handleConvert}
                        disabled={loading}
                        className="mt-6 bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? "Converting..." : "Convert & Download"}
                    </button>
                </>
            )}
        </main>
    );
}
