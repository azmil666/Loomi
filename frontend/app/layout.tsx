import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
            className={`${geist.className} bg-black text-white min-h-screen flex flex-col`}
        >
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}