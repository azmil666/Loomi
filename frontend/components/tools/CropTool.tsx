"use client";

import { useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CropTool() {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImage(url);
    };

    return (
        <div className="text-white p-10 flex flex-col items-center gap-6">

            {!image && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                />
            )}

            {image && (
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                    <img src={image} alt="Crop" className="max-h-[500px]" />
                </ReactCrop>
            )}

        </div>
    );
}