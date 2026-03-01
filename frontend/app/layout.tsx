import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Loomi – Modern Image Toolkit",
    description:
        "Convert, compress and optimize images instantly with Loomi.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
        <body
            className={`${geist.className} bg-neutral-950 text-neutral-50 min-h-screen flex flex-col`}
        >
        <Navbar />
        <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            toastOptions={{
                style: {
                    background: '#000000',
                    border: '1px solid #262626',
                },
                // This ensures the description (subtext) also inherits the status color
                success: {
                    style: {
                        color: '#4ade80',
                        borderColor: 'rgba(22, 101, 52, 0.5)',
                    },
                    descriptionClassName: "text-green-400/80",
                },
                error: {
                    style: {
                        color: '#f87171',
                        borderColor: 'rgba(153, 27, 27, 0.5)',
                    },
                    descriptionClassName: "text-red-400/80",
                },
            }}
        />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}