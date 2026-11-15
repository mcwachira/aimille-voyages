
"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/analytics";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    event: string;
    location: string;
    children: ReactNode;
};

export function TrackedAnchor({
                                  event,
                                  location,
                                  onClick,
                                  children,
                                  ...props
                              }: TrackedAnchorProps) {
    return (
        <a
            {...props}
            onClick={(e) => {
                onClick?.(e);
                track(event, { location });
            }}
        >
            {children}
        </a>
    );
}
