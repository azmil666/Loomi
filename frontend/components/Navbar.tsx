import Link from "next/link";

export default function Navbar() {
    return (
        <header className="border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/frontend/public" className="text-xl font-semibold">
                    Loomi
                </Link>

                <nav className="hidden md:flex gap-6 text-sm text-white/70">
                    <Link href="/tools/converter" className="hover:text-white transition">
                        Converter
                    </Link>
                </nav>
            </div>
        </header>
    );
}