import type { Metadata } from "next";
import { notFound } from "next/navigation";

import culture from "@/assets/culture.jpg";
import { EditorialDetail } from "@/components/site/EditorialContent";
import { editorialMetadata } from "@/lib/editorial-metadata";
import { editorialDetailPath } from "@/lib/public-content-routes";
import { getArticleBySlug, getArticleSlugs } from "@/sanity/public-content";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const entries = await getArticleSlugs();
    return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = await getArticleBySlug(slug);
    if (!item) return { title: "Travel story not found | AIMILLE VOYAGES", robots: { index: false, follow: false } };
    return editorialMetadata({
        title: item.title,
        description: item.excerpt,
        seo: item.seo,
        image: item.image,
        canonical: editorialDetailPath("articles", item.slug),
    });
}

export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = await getArticleBySlug(slug);
    if (!item) notFound();

    const publishedDate = item.publishedAt && !Number.isNaN(Date.parse(item.publishedAt))
        ? new Intl.DateTimeFormat("en-KE", { dateStyle: "long", timeZone: "UTC" }).format(new Date(item.publishedAt))
        : undefined;
    const facts = [
        ...(item.category ? [{ label: "Category", value: item.category }] : []),
        ...(publishedDate ? [{ label: "Published", value: publishedDate }] : []),
    ];
    return <EditorialDetail
        title={item.title}
        summary={item.excerpt}
        body={item.body}
        image={item.image}
        fallbackImage={culture}
        eyebrow={item.category || "Travel story"}
        facts={facts}
    />;
}
