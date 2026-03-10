"use client";

import { useState } from "react";

export default function PaletteTool() {

    const [palette, setPalette] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {

        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {

            const res = await fetch("http://localhost:5000/api/palette", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.palette && Array.isArray(data.palette)) {
                setPalette(data.palette);
            } else {
                setPalette([]);
                console.error("Palette not returned:", data);
            }

        } catch (err) {
            console.error("Upload failed:", err);
            setPalette([]);
        }
    };

    return (
        <div className="space-y-6">

            <input
                type="file"
                onChange={(e)=>setFile(e.target.files?.[0] || null)}
            />

            <button
                onClick={handleUpload}
                className="px-4 py-2 bg-black text-white rounded"
            >
                Generate Palette
            </button>

            <div className="flex gap-3">
                {palette.length > 0 && palette.map((color) => (
                    <div key={color} className="text-center">

                        <div
                            className="w-20 h-20 rounded-lg shadow-md border"
                            style={{ backgroundColor: color }}
                        />

                        <p className="text-sm">{color}</p>

                    </div>
                ))}
            </div>

        </div>
    );
}