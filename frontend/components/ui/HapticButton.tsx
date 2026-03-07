"use client";

import { useWebHaptics } from "web-haptics/react";
import { ButtonHTMLAttributes } from "react";

export default function HapticButton({
                                         children,
                                         ...props
                                     }: ButtonHTMLAttributes<HTMLButtonElement>) {

    const { trigger } = useWebHaptics();

    return (
        <button
            {...props}
            onMouseDown={(e) => {
                trigger();                 // haptic feedback
                props.onMouseDown?.(e);    // preserve original handler
            }}
        >
            {children}
        </button>
    );
}