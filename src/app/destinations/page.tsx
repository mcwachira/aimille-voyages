import type { Metadata } from "next";

import watamu from "@/assets/watamu.jpg";
import { PageHero } from "@/components/site/PageHero";
import { DestinationCard } from "@/components/site/TravelCards";
import { Reveal } from "@/components/site/Reveal";
import { FinalCta } from "@/components/site/FinalCta";
import { client } from "@/sanity/lib/client";
import { DESTINATIONS_QUERY } from "@/sanity/queries";
import type { SanityDestination } from "@/sanity/types";

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

export default async function DestinationsPage() {
    const destinations = (await client.fetch(
        DESTINATIONS_QUERY,
    )) as SanityDestination[];

    const countries = [
        ...new Set(destinations.map((destination) => destination.country)),
    ];


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
                        {destinations
                            .filter((destination) => destination.country === country)
                            .map((destination, index) => (
                                <Reveal
                                    key={destination._id}
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