"use client";

// Google Analytics 4
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID to enable analytics.

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
    interface Window {
        gtag?: (
            command: string,
            ...args: unknown[]
        ) => void;

        dataLayer?: unknown[];
    }
}

export function track(
    event: string,
    params: Record<string, unknown> = {},
) {
    if (typeof window === "undefined" || !window.gtag) {
        return;
    }

    window.gtag("event", event, params);
}