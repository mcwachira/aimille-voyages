
"use client";

import { useEffect, useRef } from "react";

import { waMsg } from "@/content/site";
import { WhatsAppLink } from "./WhatsAppLink";

export function EnquirySuccess({
                                   whatsappTopic,
                               }: {
    whatsappTopic: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({
            block: "center",
            behavior: "smooth",
        });

        ref.current?.focus({ preventScroll: true });
    }, []);

    return (
        <div
            ref={ref}
            tabIndex={-1}
            className="border border-gold/50 bg-card p-7 text-center outline-none sm:p-10 md:p-12"
            role="status"
            aria-live="polite"
        >
            <span className="gold-rule mx-auto" aria-hidden="true" />

            <p className="eyebrow mt-6 text-gold-readable">
                Enquiry received
            </p>

            <h3 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">
                Thank you.
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Thank you for considering AIMILLE VOYAGES. Your enquiry has been
                received. Our team will review your requirements and get in touch
                to discuss your experience.
            </p>

            <div className="mt-8 flex justify-center">
                <WhatsAppLink
                    location="after_submit"
                    variant="line"
                    message={`${waMsg(whatsappTopic)} I have just sent an enquiry through your website.`}
                    className="w-full sm:w-auto"
                >
                    Follow up on WhatsApp
                </WhatsAppLink>
            </div>
        </div>
    );
}
