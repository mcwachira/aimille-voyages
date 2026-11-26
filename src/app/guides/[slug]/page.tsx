import type { Metadata } from "next";
import { notFound } from "next/navigation";

import watamu from "@/assets/watamu.jpg";
import { EditorialDetail } from "@/components/site/EditorialContent";
import { editorialMetadata } from "@/lib/editorial-metadata";
import { editorialDetailPath } from "@/lib/public-content-routes";
import { getGuideBySlug, getGuideSlugs } from "@/sanity/public-content";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const entries = await getGuideSlugs();
    return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = await getGuideBySlug(slug);
    if (!item) return { title: "Travel guide not found | AIMILLE VOYAGES", robots: { index: false, follow: false } };
    return editorialMetadata({
        title: item.title,
        description: item.summary,
        seo: item.seo,
        image: item.image,
        canonical: editorialDetailPath("guides", item.slug),
    });
}

export default async function GuideDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = await getGuideBySlug(slug);
    if (!item) notFound();
    return <EditorialDetail
        title={item.title}
        summary={item.summary}
        body={item.body}
        image={item.image}
        fallbackImage={watamu}
        eyebrow="Travel guide"
        destinations={item.destinations}
        experiences={item.experiences}
    />;
}
