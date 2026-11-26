import type { Metadata } from "next";

import adventure from "@/assets/adventure.jpg";
import { EditorialListing, type EditorialCardData } from "@/components/site/EditorialContent";
import { getTravelPackages } from "@/sanity/public-content";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Curated Travel Packages | AIMILLE VOYAGES",
    description: "Explore curated journeys, stays and experiences from AIMILLE VOYAGES.",
    alternates: { canonical: "/packages" },
    openGraph: {
        title: "Curated Travel Packages | AIMILLE VOYAGES",
        description: "Explore curated journeys, stays and experiences from AIMILLE VOYAGES.",
        type: "website",
        url: "/packages",
    },
};

export default async function PackagesPage() {
    const packages = await getTravelPackages();
    const items: EditorialCardData[] = packages.map((item) => ({
        kind: "packages",
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        image: item.image,
        eyebrow: [item.featured ? "Featured journey" : "Curated journey", item.duration].filter(Boolean).join(" · "),
    }));

    return <EditorialListing
        kind="packages"
        title="Travel packages"
        heroTitle="Journeys shaped around you."
        heroAlt="Hot air balloons rising above the Maasai Mara at sunrise"
        description="Explore curated travel packages from AIMILLE VOYAGES."
        heroImage={adventure}
        items={items}
        emptyMessage="Travel packages are not available yet. Please check back soon or tell us what you have in mind."
    />;
}
