"use client";

import { useState } from "react";

export default function BlurTool() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/blur", {
                method: "POST",
                body: formData
            });

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            setResult(url);

        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">

            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files) {
                        const selected = e.target.files[0];
                        setFile(selected);
                        setPreview(URL.createObjectURL(selected));
                    }
                }}
            />

            <button
                onClick={handleUpload}
                className="px-6 py-3 bg-blue-500 text-white rounded"
            >
                {loading ? "Processing..." : "Apply Blur"}
            </button>

            {preview && (
                <div>
                    <h2 className="text-xl font-semibold">Original</h2>
                    <img src={preview} className="max-w-md rounded"/>
                </div>
            )}

            {result && (
                <div>
                    <h2 className="text-xl font-semibold">Blurred Result</h2>
                    <img src={result} className="max-w-md rounded"/>
                </div>
            )}

        </div>
    );
}