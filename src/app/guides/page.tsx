import type { Metadata } from "next";

import watamu from "@/assets/watamu.jpg";
import { EditorialListing, type EditorialCardData } from "@/components/site/EditorialContent";
import { getGuides } from "@/sanity/public-content";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Travel Guides | AIMILLE VOYAGES",
    description: "Practical travel guides to help you prepare for journeys across Kenya and beyond.",
    alternates: { canonical: "/guides" },
    openGraph: {
        title: "Travel Guides | AIMILLE VOYAGES",
        description: "Practical travel guides to help you prepare for journeys across Kenya and beyond.",
        type: "website",
        url: "/guides",
    },
};

export default async function GuidesPage() {
    const guides = await getGuides();
    const items: EditorialCardData[] = guides.map((item) => ({
        kind: "guides",
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        image: item.image,
        eyebrow: item.featured ? "Featured guide" : "Travel guide",
    }));

    return <EditorialListing
        kind="guides"
        title="Travel guides"
        heroTitle="Plan with local knowledge."
        heroAlt="Watamu lagoon with coral islets"
        description="Practical guides to help you prepare for your journey."
        heroImage={watamu}
        items={items}
        emptyMessage="Travel guides are being prepared. Please check back soon."
    />;
}
