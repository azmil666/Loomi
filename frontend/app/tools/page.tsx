import {
    Crop,
    Image as ImageIcon,
    ImageOff,
    Layers,
    Maximize2,
    Minimize2, QrCode,
    ShieldOff,
    SlidersHorizontal,
    Type,
    Wand2
} from "lucide-react";
import GlassIcons from "@/components/GlassIcons";

export default function ToolsPage() {
    const toolItems = [
        {
            icon: <ImageIcon className="w-6 h-6" />,
            color: "rgba(163, 163, 163, 1)",
            label: "Image Converter",
            href: "/tools/converter"
        },
        {
            icon: <Minimize2 className="w-6 h-6" />,
            color: "rgba(163, 163, 163, 1)",
            label: "Image Compressor",
            href: "/tools/compressor"
        },
        {
        icon: <Wand2 className="w-6 h-6" />,
        color: "rgba(163, 163, 163, 1)",
        label: "Background Removal",
        href: "/tools/background-removal"
    },
        {
            icon: <Crop className="w-6 h-6" />,
            color: "rgba(163, 163, 163, 1)",
            label: "Image Crop",
            href: "/tools/crop"
        },
        {
            icon: <Maximize2 className="w-6 h-6" />,
            color: "rgba(163, 163, 163, 1)",
            label: "Image Resizer",
            href: "/tools/resizer"
        },
        {
            icon: <ShieldOff className="w-6 h-6" />,
            color: "rgba(163, 163, 163, 1)",
            label: "Metadata Stripper",
            href: "/tools/strip-metadata"
        },
        {
            icon: <Layers className="w-6 h-6" />,
            color: "rgba(163,163,163,1)",
            label: "Bulk Processor",
            href: "/tools/bulk"
        },
        {
            icon: <ImageOff className="w-6 h-6" />,
            color: "rgba(163,163,163,1)",
            label: "Blur Tool",
            href: "/tools/blur"
        },
        {icon: <SlidersHorizontal className="w-6 h-6" />,
            color: "rgba(163,163,163,1)",
            label: "Filter Tool",
            href: "/tools/filters"
        },
        {
            icon: <Type className="w-6 h-6" />,
            color: "rgba(163,163,163,1)",
            label: "Image → ASCII",
            href: "/tools/ascii"
        },
        {
            icon: <QrCode className="w-6 h-6" />,
            color: "rgba(163,163,163,1)",
            label: "Image → QR",
            href: "/tools/image-to-qr"
        }
    ];

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center px-6 pt-40 pb-20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[400px] h-[400px] bg-neutral-400/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center mb-16">
                <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                    Toolbox
                </h1>
                <p className="text-neutral-400 max-w-md mx-auto text-lg">
                    High-performance image transformation, refined for the modern web.
                </p>
            </div>

            <div className="relative z-10">
                <GlassIcons
                    items={toolItems}
                    className="gap-8"
                />
            </div>


            <p className="mt-12 text-neutral-500 text-sm font-medium animate-pulse">
                Select a tool to launch
            </p>
        </main>
    );
}