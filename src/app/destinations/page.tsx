
import type { Metadata } from "next";
import Image from "next/image";

import watamu from "@/assets/watamu.jpg";
import { PageHero } from "@/components/site/PageHero";
import { DestinationCard } from "@/components/site/TravelCards";
import { Reveal } from "@/components/site/Reveal";
import { DESTINATIONS } from "@/content/destinations";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata: Metadata = {
    title: "Kenya Destinations | Safari & Beach | AIMILLE VOYAGES",
    description:
        "Nairobi, Maasai Mara, Amboseli, Tsavo, Diani Beach, Watamu and Mombasa. Explore Kenya's most beautiful destinations.",
    alternates: {
        canonical: "/destinations",
    },
    openGraph: {
        title: "Kenya Destinations | Safari & Beach | AIMILLE VOYAGES",
        description:
            "Explore Nairobi, Maasai Mara, Amboseli, Tsavo, Diani Beach, Watamu and Mombasa with AIMILLE VOYAGES.",
        type: "website",
    },
};

export default function DestinationsPage() {
    const countries = [...new Set(DESTINATIONS.map((destination) => destination.country))];

    return (
        <>
            <PageHero
                image={watamu}
                alt="Watamu lagoon with coral islets"
                eyebrow="Destinations"
                title="From the savannah to the sea."
            >
                Kenya first, with more of the world to come.
            </PageHero>

            {countries.map((country) => (
                <section key={country} className="container-x py-24">
                    <h2 className="text-5xl text-primary">{country}</h2>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {DESTINATIONS
                            .filter((destination) => destination.country === country)
                            .map((destination, index) => (
                                <Reveal
                                    key={destination.slug}
                                    delay={(index % 3) * 80}
                                >
                                    <DestinationCard d={destination} />
                                </Reveal>
                            ))}
                    </div>
                </section>
            ))}

            <FinalCta />
        </>
    );
}
