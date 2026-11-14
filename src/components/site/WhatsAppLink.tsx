"use client";

import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
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
};

export function WhatsAppLink({
                                 message,
                                 children,
                                 className,
                                 variant,
                                 location,
                             }: WhatsAppLinkProps) {
    return (
        <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location })}
            className={cn(
                variant && buttonVariants({ variant, size: "xl" }),
                className,
            )}
        >
            {variant && <MessageCircle aria-hidden="true" />}
            {children ?? "Chat with us on WhatsApp"}
        </a>
    );
}

export function WhatsAppFloat() {
    return (
        <a
            href={whatsappUrl(
                "Hello AIMILLE VOYAGES, I would like to plan an experience in Kenya.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with AIMILLE VOYAGES on WhatsApp"
            onClick={() => track("whatsapp_click", { location: "floating" })}
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-band text-band-foreground shadow-soft ring-1 ring-gold/60 transition-transform hover:scale-105"
        >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </a>
    );
}