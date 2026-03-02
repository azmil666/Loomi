"use client";

import { useEffect } from "react";

export default function WakeBackend() {
    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
            method: "GET",
            cache: "no-store",
        }).catch(() => {});
    }, []);

    return null;
}