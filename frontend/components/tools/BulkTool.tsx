"use client"

import { useState } from "react"

export default function BulkTool() {

    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [operation, setOperation] = useState("compress")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        setFiles(Array.from(e.target.files))
    }

    const handleUpload = async () => {

        if (files.length === 0) return

        const formData = new FormData()

        files.forEach((file) => {
            formData.append("images", file)
        })

        setLoading(true)

        try {

            const res = await fetch(
                `http://localhost:5000/api/bulk?operation=${operation}`,
                {
                    method: "POST",
                    body: formData
                }
            )

            const blob = await res.blob()

            const url = window.URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.href = url
            a.download = "loomi-bulk-output.zip"
            a.click()

        } catch (err) {
            console.error(err)
        }

        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">

            <h1 className="text-3xl font-bold text-white">
                Bulk Image Processor
            </h1>

            {/* Operation Selector */}

            <div className="space-y-2">
                <label className="text-sm text-gray-400">
                    Operation
                </label>

                <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                >
                    <option value="compress">Compress</option>
                    <option value="resize">Resize</option>
                    <option value="convert">Convert</option>
                    <option value="stripMetadata">Strip Metadata</option>
                </select>
            </div>

            {/* File Upload */}

            <div className="space-y-3">

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-lg file:border-0
                               file:text-sm file:font-semibold
                               file:bg-white file:text-black
                               hover:file:bg-gray-200"
                />

                {files.length > 0 && (
                    <p className="text-sm text-gray-400">
                        {files.length} file{files.length > 1 && "s"} selected
                    </p>
                )}

            </div>

            {/* File Preview List */}

            {files.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">

                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="text-sm text-gray-300 flex justify-between"
                        >
                            <span>{file.name}</span>
                            <span className="text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                        </div>
                    ))}

                </div>
            )}

            {/* Process Button */}

            <button
                onClick={handleUpload}
                disabled={loading || files.length === 0}
                className="w-full py-3 rounded-lg bg-white text-black font-semibold
                           hover:bg-gray-200 transition disabled:opacity-50"
            >
                {loading ? "Processing Images..." : "Process Images"}
            </button>

        </div>
    )
}