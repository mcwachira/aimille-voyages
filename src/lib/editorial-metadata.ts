import type { Metadata } from "next";

import type { SanityEditorialSeo, SanityImage } from "@/sanity/types";

export function editorialMetadata({
    title,
    description,
    seo,
    canonical,
    image,
}: {
    title: string;
    description: string;
    seo?: SanityEditorialSeo;
    canonical: string;
    image?: SanityImage;
}): Metadata {
    const pageTitle = seo?.metaTitle?.trim() || `${title} | AIMILLE VOYAGES`;
    const pageDescription = seo?.metaDescription?.trim() || description;
    const imageUrl = image?.asset?.url;
    const images = imageUrl ? [{ url: imageUrl, alt: title }] : undefined;

    return {
        title: pageTitle,
        description: pageDescription,
        alternates: { canonical },
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            type: "article",
            url: canonical,
            images,
        },
        twitter: {
            card: images ? "summary_large_image" : "summary",
            title: pageTitle,
            description: pageDescription,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}
