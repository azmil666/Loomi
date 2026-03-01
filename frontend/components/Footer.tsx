export default function Footer() {
    return (
        <footer className="border-t border-white/10 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-white/50 text-center">
                © {new Date().getFullYear()} Loomi. All rights reserved.
            </div>
        </footer>
    );
}