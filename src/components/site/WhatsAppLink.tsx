
"use client";

import type { ReactNode } from "react";
import { whatsappUrl } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type WhatsAppLinkProps = {
    message?: string;
    children?: ReactNode;
    className?: string;
    variant?: "brand" | "gold" | "ghostLight" | "line";
    location: string;
    iconOnly?: boolean;
};

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={cn("shrink-0", className)}
        >
            <path d="M12.04 2a9.87 9.87 0 0 0-8.45 15l-1.05 3.84 3.94-1.03A9.96 9.96 0 0 0 12.04 22C17.56 22 22 17.52 22 12S17.56 2 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-2.34.61.63-2.28-.2-.32a8.18 8.18 0 1 1 6.4 3.32Zm4.5-6.13c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.13-.17.25-.65.81-.8.98-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-.1-.74-.67-1.23-1.5-1.38-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.76 2.69 4.26 3.77.6.26 1.07.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.17-.48-.29Z" />
        </svg>
    );
}

export function WhatsAppLink({
                                 message,
                                 children,
                                 className,
                                 variant,
                                 location,
                                 iconOnly = false,
                             }: WhatsAppLinkProps) {
    return (
        <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={iconOnly ? "Chat with us on WhatsApp" : undefined}
            onClick={() => track("whatsapp_click", { location })}
            className={cn(
                "inline-flex items-center justify-center gap-2",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                variant && buttonVariants({ variant, size: "xl" }),
                className,
            )}
        >
            <WhatsAppIcon className="h-5 w-5" />
            {!iconOnly && (
                <span>{children ?? "Chat with us on WhatsApp"}</span>
            )}
        </a>
    );
}

export function WhatsAppFloat() {
    const message =
        "Hello AIMILLE VOYAGES, I would like to plan an experience in Kenya.";

    return (
        <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with AIMILLE VOYAGES on WhatsApp"
            title="Chat with us on WhatsApp"
            onClick={() => track("whatsapp_click", { location: "floating" })}
            className={cn(
                "group fixed z-40",
                "right-4 bottom-4 sm:right-6 sm:bottom-6",
                "flex items-center justify-center gap-3",
                "h-14 w-14 sm:h-auto sm:w-auto sm:rounded-full",
                "rounded-full sm:px-5 sm:py-3",
                "bg-[#25D366] text-white",
                "shadow-lg shadow-black/15",
                "ring-1 ring-white/20",
                "transition-all duration-300",
                "hover:-translate-y-1 hover:bg-[#20BD5A] hover:shadow-xl",
                "active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
                "bottom-[max(1rem,env(safe-area-inset-bottom))]",
            )}
        >
            <WhatsAppIcon className="h-7 w-7 sm:h-6 sm:w-6" />

            <span className="hidden text-sm font-semibold sm:inline">
        Chat with us
      </span>
        </a>
    );
}
