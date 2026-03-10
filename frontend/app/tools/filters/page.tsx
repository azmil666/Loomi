"use client";

import { useState } from "react";

const filters = [
  { name: "Original", value: "original", css: "none" },
  { name: "B/W", value: "bw", css: "grayscale(100%)" },
  { name: "Cool", value: "cool", css: "hue-rotate(180deg) saturate(1.2)" },
  { name: "Warm", value: "warm", css: "sepia(40%) saturate(1.3)" },
  { name: "Sepia", value: "sepia", css: "sepia(100%)" },
];

export default function FiltersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setSelectedFilter(filters[0]);
  };

  const applyFilter = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("filter", selectedFilter.value);

    const res = await fetch("http://localhost:5000/api/images/filter", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered.png";
    a.click();

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-white">

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Image Filters
        </h1>

        {/* Upload */}
        {!preview && (
          <label className="flex items-center justify-center w-full border border-white/10 rounded-xl p-10 cursor-pointer hover:bg-white/5 transition">
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0] || null)}
            />
            <span className="text-white/70">Click to upload image</span>
          </label>
        )}

        {/* Main Preview */}
        {preview && (
          <div className="flex flex-col items-center gap-6">

            <img
              src={preview}
              style={{ filter: selectedFilter.css }}
              className="max-h-96 object-contain rounded-xl border border-white/10 transition duration-300"
            />

            {/* Sliding Filter Preview Strip */}
            <div className="w-full overflow-x-auto">
              <div className="flex gap-4 pb-2">

                {filters.map((f) => (
                  <div
                    key={f.value}
                    onClick={() => setSelectedFilter(f)}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition
                      ${
                        selectedFilter.value === f.value
                          ? "bg-white/10 border border-white/20"
                          : "hover:bg-white/5"
                      }`}
                  >

                    <img
                      src={preview}
                      style={{ filter: f.css }}
                      className="w-24 h-24 object-cover rounded-md border border-white/10"
                    />

                    <span className="text-xs mt-2 text-white/70">
                      {f.name}
                    </span>

                  </div>
                ))}

              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilter}
              disabled={loading}
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition active:scale-95 disabled:opacity-40"
            >
              {loading ? "Processing..." : "Apply & Download"}
            </button>

          </div>
        )}

      </div>

    </main>
  );
}