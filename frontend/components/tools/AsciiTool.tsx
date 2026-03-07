"use client";

import { useState } from "react";

export default function AsciiTool() {
    const [file, setFile] = useState<File | null>(null);
    const [ascii, setAscii] = useState("");

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:5000/api/ascii", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setAscii(data.ascii);
    };

    return (
        <div className="space-y-6">

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
                onClick={handleUpload}
                className="px-4 py-2 bg-white text-black rounded"
            >
                Convert
            </button>

            <pre className="bg-black text-green-400 p-4 overflow-x-auto text-xs">
        {ascii}
      </pre>

        </div>
    );
}