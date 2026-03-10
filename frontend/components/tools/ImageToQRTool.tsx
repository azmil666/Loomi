"use client";

import { useState } from "react";

export default function ImageToQRTool() {

    const [file, setFile] = useState<File | null>(null);
    const [qr, setQr] = useState<string | null>(null);

    const handleUpload = async () => {

        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:5000/api/qr/image", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        setQr(data.qr);
    };

    return (
        <div className="space-y-4">

            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Generate QR
            </button>

            {qr && (
                <div>
                    <img src={qr} alt="QR Code" />
                </div>
            )}

        </div>
    );
}