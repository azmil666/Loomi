"use client"

import { useState } from "react"

export default function BulkTool() {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)

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
            const res = await fetch("http://localhost:5000/api/bulk", {
                method: "POST",
                body: formData
            })

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
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Bulk Image Processor
            </h1>

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />

            <button
                onClick={handleUpload}
                className="px-6 py-3 bg-black text-white rounded-lg"
            >
                {loading ? "Processing..." : "Process Images"}
            </button>

        </div>
    )
}