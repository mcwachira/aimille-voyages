import type { Metadata } from "next";

import { TripPlanner } from "@/components/site/TripPlanner";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { waMsg } from "@/content/site";

export const metadata: Metadata = {
    title: "Plan Your Trip to Kenya | AIMILLE VOYAGES",
    description:
        "Tell us about your journey in a few simple steps and we'll help shape a personalised Kenya experience.",
    alternates: {
        canonical: "/plan-your-trip",
    },
    openGraph: {
        title: "Plan Your Trip to Kenya | AIMILLE VOYAGES",
        description:
            "Tell us about your journey in a few simple steps and we'll help shape a personalised Kenya experience.",
        url: "/plan-your-trip",
        type: "website",
    },
};

export default function PlanYourTripPage() {
    return (
        <section className="container-x grid gap-16 pb-24 pt-36 md:pt-44 lg:grid-cols-[1fr_2fr]">
            <div>
                <p className="eyebrow text-gold">Plan Your Trip</p>

                <h1 className="mt-5 text-5xl text-primary md:text-6xl">
                    Let's shape your journey.
                </h1>

                <p className="mt-6 leading-relaxed text-muted-foreground">
                    A few questions help us understand what you have in mind. Still
                    exploring? That's fine. Leave dates and budget open.
                </p>

                <p className="mt-8 text-sm text-muted-foreground">Prefer to talk?</p>

                <WhatsAppLink
                    location="planner_side"
                    variant="line"
                    className="mt-3"
                    message={waMsg("planning a trip")}
                />
            </div>

            <div className="border border-border bg-card p-6 md:p-12">
                <TripPlanner />
            </div>
        </section>
    );
}
}