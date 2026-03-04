import Link from "next/link";
import WakeBackend from "@/components/WakeBackend";
import LightPillar from "@/components/ui/LightPillar";

export default function Home() {
    return (
        <>
            {/* FULLSCREEN BACKGROUND EFFECT */}
            <div className="fixed inset-0 -z-10">
                <LightPillar
                    topColor="#ababab"
                    bottomColor="#030203"
                    intensity={1}
                    rotationSpeed={0.3}
                    glowAmount={0.002}
                    pillarWidth={3}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={25}
                    interactive={false}
                    mixBlendMode="normal"
                    quality="high"
                />
            </div>
        <main className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden  text-white">

            <WakeBackend />
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black-950 to-transparent blur-[120px]" />
            </div>

            <div className="relative z-10 text-center max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    Welcome to Loomi
                </h1>

                <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
                    The high-performance internal tool for seamless image format transformation and optimization.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/tools"
                        className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all active:scale-95"
                    >
                        Get Started
                    </Link>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                        Documentation
                    </button>
                </div>
            </div>

            {/* Footer-style hint */}
            <div className="absolute bottom-10 text-white/20 text-sm font-mono tracking-widest uppercase">
                Loomi v1.0.0
            </div>
        </main>
            </>
    );
}