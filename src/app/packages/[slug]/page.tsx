import type { Metadata } from "next";
import { notFound } from "next/navigation";

import adventure from "@/assets/adventure.jpg";
import { EditorialDetail } from "@/components/site/EditorialContent";
import { editorialMetadata } from "@/lib/editorial-metadata";
import { editorialDetailPath } from "@/lib/public-content-routes";
import { getTravelPackageBySlug, getTravelPackageSlugs } from "@/sanity/public-content";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const entries = await getTravelPackageSlugs();
    return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = await getTravelPackageBySlug(slug);
    if (!item) return { title: "Travel package not found | AIMILLE VOYAGES", robots: { index: false, follow: false } };
    return editorialMetadata({
        title: item.title,
        description: item.summary,
        seo: item.seo,
        image: item.image,
        canonical: editorialDetailPath("packages", item.slug),
    });
}

export default async function PackageDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = await getTravelPackageBySlug(slug);
    if (!item) notFound();

    const facts = item.duration ? [{ label: "Duration", value: item.duration }] : [];
    return <EditorialDetail
        title={item.title}
        summary={item.summary}
        body={item.description}
        image={item.image}
        fallbackImage={adventure}
        eyebrow="Curated travel package"
        facts={facts}
        destinations={item.destinations}
        experiences={item.experiences}
    />;
}
