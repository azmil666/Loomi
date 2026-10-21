"use client";

import { useState } from "react";

export default function SketchTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    setFile(uploaded);
    setPreview(URL.createObjectURL(uploaded));
    setResult(null);
  };

  const applySketch = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/images/sketch", {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    setResult(url);
    setLoading(false);
  };

  const downloadImage = () => {
    if (!result) return;

    const a = document.createElement("a");
    a.href = result;
    a.download = "pencil-sketch.png";
    a.click();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Pencil Sketch Filter
      </h1>

      <div className="w-full max-w-xl flex flex-col items-center gap-6">

        {/* Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="bg-white/10 border border-white/20 rounded-lg p-2"
        />

        {/* Preview */}
        {preview && (
          <div className="w-full rounded-xl overflow-hidden border border-white/10">
            <img
              src={preview}
              alt="preview"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">

          <button
            onClick={applySketch}
            disabled={!file || loading}
            className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition"
          >
            {loading ? "Processing..." : "Apply Sketch"}
          </button>

          {result && (
            <button
              onClick={downloadImage}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition"
            >
              Download
            </button>
          )}

        </div>

        {/* Result */}
        {result && (
          <div className="w-full rounded-xl overflow-hidden border border-white/10">
            <img
              src={result}
              alt="sketch result"
              className="w-full object-cover"
            />
          </div>
        )}

      </div>
    </main>
  );
}