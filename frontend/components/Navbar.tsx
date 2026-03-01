"use client";

import { usePathname } from "next/navigation";
import PillNav from "@/components/ui/PillNav";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <PillNav
            logo="/loomi.webp"
            logoAlt="Loomi Logo"
            items={[
                { label: "Home", href: "/" },
                { label: "Converter", href: "/tools/converter" },
            ]}
            className="custom-nav"
            activeHref={pathname}
            ease="power2.easeOut"
            baseColor="#111111"
            pillColor="#ffffff"
            pillTextColor="#111111"
            hoveredPillTextColor="#ffffff"
            initialLoadAnimation={false}
        />
    );
}