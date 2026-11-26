
import type { Metadata } from "next";

import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { TrackedAnchor } from "@/components/site/TrackedAnchor";
import { SITE, waMsg } from "@/content/site";

export const metadata: Metadata = {
    title: "Contact AIMILLE VOYAGES | WhatsApp, Email & Social",
    description:
        "Get in touch with AIMILLE VOYAGES on WhatsApp +254 112 414 190 or email aimillevoyages@gmail.com.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact AIMILLE VOYAGES",
        description:
            "Talk to our team about travel planning, accommodation, transfers and lifestyle concierge services in Kenya.",
        url: "/contact",
        type: "website",
    },
};

const CONTACTS = [
    {
        title: "WhatsApp",
        value: SITE.whatsappDisplay,
        description: "Chat with us about your plans",
        type: "whatsapp",
    },
    {
        title: "Email",
        value: SITE.email,
        description: "Send us your enquiry",
        type: "email",
    },
    {
        title: "Instagram",
        value: SITE.handle,
        description: "Follow our latest updates",
        type: "instagram",
    },
    {
        title: "TikTok",
        value: SITE.handle,
        description: "Explore more of our world",
        type: "tiktok",
    },
] as const;

export default function ContactPage() {
    return (
        <section className="container-x grid gap-14 pb-20 pt-32 sm:pt-36 md:pb-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-44">
            {/* Contact information */}
            <div className="flex flex-col">
                <div>
                    <p className="eyebrow text-gold-readable">Get in touch</p>

                    <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[1.08] text-primary sm:text-6xl lg:text-7xl">
                        Let&apos;s Start Planning Something Wonderful.
                    </h1>

                    <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                        Whether you are planning a getaway, need assistance with your
                        stay, or simply want to explore what we offer, we would love to
                        hear from you.
                    </p>
                </div>

                <div className="mt-10 divide-y divide-border border-y border-border">
                    {CONTACTS.map((contact) => (
                        <div
                            key={contact.type}
                            className="group py-6 transition-colors duration-300"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="eyebrow text-muted-foreground">
                                        {contact.title}
                                    </p>

                                    <div className="mt-2 break-words font-serif text-2xl text-primary transition-colors duration-300 group-hover:text-gold-readable sm:text-3xl">
                                        {contact.type === "whatsapp" && (
                                            <WhatsAppLink
                                                location="contact_list"
                                                message={waMsg("planning a trip")}
                                                className="font-serif text-inherit hover:text-gold-readable"
                                            >
                                                {contact.value}
                                            </WhatsAppLink>
                                        )}

                                        {contact.type === "email" && (
                                            <TrackedAnchor
                                                href={`mailto:${SITE.email}`}
                                                event="email_click"
                                                location="contact"
                                                className="break-all hover:text-gold-readable"
                                            >
                                                {contact.value}
                                            </TrackedAnchor>
                                        )}

                                        {contact.type === "instagram" && (
                                            <a
                                                href={SITE.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-gold-readable"
                                            >
                                                {contact.value}
                                            </a>
                                        )}

                                        {contact.type === "tiktok" && (
                                            <a
                                                href={SITE.tiktok}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-gold-readable"
                                            >
                                                {contact.value}
                                            </a>
                                        )}
                                    </div>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {contact.description}
                                    </p>
                                </div>

                                <span
                                    className="shrink-0 pt-1 text-sm text-gold-readable transition-transform duration-300 group-hover:translate-x-1"
                                    aria-hidden="true"
                                >
                  ↗
                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <WhatsAppLink
                        location="contact_cta"
                        variant="brand"
                        message={waMsg("planning a trip")}
                        className="w-full sm:w-fit"
                    >
                        Start a WhatsApp conversation
                    </WhatsAppLink>
                </div>
            </div>

            {/* Enquiry form */}
            <div className="h-fit border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10 lg:sticky lg:top-28">
                <div className="mb-8">
                    <p className="eyebrow text-gold-readable">Send an enquiry</p>

                    <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">
                        Tell us what you have in mind.
                    </h2>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Share a few details and our team will get back to you to discuss
                        how we can help.
                    </p>
                </div>

                <EnquiryForm
                    category="contact"
                    sourcePage="/contact"
                    whatsappTopic="my message"
                />
            </div>
        </section>
    );
}
