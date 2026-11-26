import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getService } from "@/content/services";
import { ServiceDetail } from "@/components/site/ServiceDetail";

export const metadata: Metadata = {
    title: "Long-Stay & Relocation Concierge in Kenya | AIMILLE VOYAGES",
    description:
        "Support for 30, 60 and 90+ day stays in Kenya: accommodation sourcing, airport arrival, transport, orientation and ongoing concierge assistance.",
    alternates: {
        canonical: "/long-stay",
    },
    openGraph: {
        title: "Long-Stay & Relocation Concierge in Kenya | AIMILLE VOYAGES",
        description:
            "Support for 30, 60 and 90+ day stays in Kenya, including accommodation sourcing, airport arrival, transport and concierge assistance.",
        url: "/long-stay",
        type: "website",
    },
};

const STAYS = [
    ["30 Days", "A Month in Kenya"],
    ["60 Days", "An Extended Escape"],
    ["90 Days+", "Settling into the Experience"],
];

export default function LongStayPage() {
    const service = getService("long-stay");

    if (!service) {
        notFound();
    }

    return (
        <>
            <ServiceDetail
                s={service}
                title="Feel at Home in Kenya. Before You Even Arrive."
            />

            <section className="bg-band py-24 text-band-foreground">
                <div className="container-x">
                    <p className="eyebrow text-gold-readable">Indicative stay durations</p>

                    <div className="mt-10 grid gap-px bg-gold/30 md:grid-cols-3">
                        {STAYS.map(([duration, title]) => (
                            <div key={duration} className="bg-band p-10">
                                <p className="font-serif text-6xl text-gold-readable">{duration}</p>
                                <p className="eyebrow mt-4 text-ivory">{title}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ivory/70">
                        These are indicative durations, not fixed packages. Every long
                        stay is planned around you. We do not provide legal, immigration,
                        tax, employment or residency advice. Where these matters arise,
                        we recommend speaking with appropriately qualified professionals.
                    </p>
                </div>
            </section>
        </>
    );
}
