import type { Metadata } from "next";

import culture from "@/assets/culture.jpg";
import { EditorialListing, type EditorialCardData } from "@/components/site/EditorialContent";
import { getArticles } from "@/sanity/public-content";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Travel Stories | AIMILLE VOYAGES",
    description: "Ideas, stories and perspectives to inspire your next journey with AIMILLE VOYAGES.",
    alternates: { canonical: "/articles" },
    openGraph: {
        title: "Travel Stories | AIMILLE VOYAGES",
        description: "Ideas, stories and perspectives to inspire your next journey with AIMILLE VOYAGES.",
        type: "website",
        url: "/articles",
    },
};

export default async function ArticlesPage() {
    const articles = await getArticles();
    const items: EditorialCardData[] = articles.map((item) => ({
        kind: "articles",
        title: item.title,
        slug: item.slug,
        summary: item.excerpt,
        image: item.image,
        eyebrow: item.category || (item.featured ? "Featured story" : "Travel story"),
    }));

    return <EditorialListing
        kind="articles"
        title="Travel stories"
        heroTitle="Ideas for your next journey."
        heroAlt="A cultural travel experience in Kenya"
        description="Stories and perspectives to inspire your next journey."
        heroImage={culture}
        items={items}
        emptyMessage="There are no travel stories to read just yet. Please check back soon."
    />;
}
