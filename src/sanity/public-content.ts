import { defineQuery } from "next-sanity";

import { client } from "@/sanity/lib/client";
import type { SanityArticle, SanityGuide, SanityTravelPackage } from "@/sanity/types";

const publishedContent = (type: string) =>
    `_type == "${type}" && !(_id in path("drafts.**")) && defined(slug.current)`;

const imageProjection = `image { ..., asset->{_id, url, metadata { dimensions, lqip }} }`;
const destinationReferences = `destinations[]->{_id, name, "slug": slug.current, country, region, summary, image { ..., asset->{_id, url, metadata { dimensions, lqip }} }}`;
const experienceReferences = `experiences[]->{_id, title, "slug": slug.current, description, duration, durationVerified, image { ..., asset->{_id, url, metadata { dimensions, lqip }} }}`;

export const TRAVEL_PACKAGES_QUERY = defineQuery(`
    *[${publishedContent("travelPackage")}] | order(featured desc, _updatedAt desc) {
        _id,
        _updatedAt,
        title,
        "slug": slug.current,
        summary,
        duration,
        featured,
        ${imageProjection},
        seo
    }
`);

export const TRAVEL_PACKAGE_BY_SLUG_QUERY = defineQuery(`
    *[${publishedContent("travelPackage")} && slug.current == $slug][0] {
        _id,
        _updatedAt,
        title,
        "slug": slug.current,
        summary,
        description,
        duration,
        featured,
        ${imageProjection},
        "destinations": ${destinationReferences},
        "experiences": ${experienceReferences},
        seo
    }
`);

export const TRAVEL_PACKAGE_SLUGS_QUERY = defineQuery(`
    *[${publishedContent("travelPackage") }]{"slug": slug.current}
`);

export const ARTICLES_QUERY = defineQuery(`
    *[${publishedContent("article")}] | order(publishedAt desc, _updatedAt desc) {
        _id,
        _updatedAt,
        title,
        "slug": slug.current,
        "summary": excerpt,
        category,
        publishedAt,
        featured,
        ${imageProjection},
        seo
    }
`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`
    *[${publishedContent("article")} && slug.current == $slug][0] {
        _id,
        _updatedAt,
        title,
        "slug": slug.current,
        "summary": excerpt,
        excerpt,
        body,
        category,
        publishedAt,
        featured,
        ${imageProjection},
        seo
    }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(`
    *[${publishedContent("article") }]{"slug": slug.current}
`);

export const GUIDES_QUERY = defineQuery(`
    *[${publishedContent("guide")}] | order(featured desc, _updatedAt desc) {
        _id,
        _updatedAt,
        title,
        "slug": slug.current,
        summary,
        featured,
        ${imageProjection}
    }
`);

export const GUIDE_BY_SLUG_QUERY = defineQuery(`
    *[${publishedContent("guide")} && slug.current == $slug][0] {
        _id,
        _updatedAt,
        title,
        "slug": slug.current,
        summary,
        body,
        featured,
        ${imageProjection},
        "destinations": ${destinationReferences},
        "experiences": ${experienceReferences},
        seo
    }
`);

export const GUIDE_SLUGS_QUERY = defineQuery(`
    *[${publishedContent("guide") }]{"slug": slug.current}
`);

type SlugResult = { slug: string };

export async function getTravelPackages() {
    return client.fetch<SanityTravelPackage[]>(TRAVEL_PACKAGES_QUERY);
}

export async function getTravelPackageBySlug(slug: string) {
    return client.fetch<SanityTravelPackage | null>(TRAVEL_PACKAGE_BY_SLUG_QUERY, { slug });
}

export async function getTravelPackageSlugs() {
    return client.fetch<SlugResult[]>(TRAVEL_PACKAGE_SLUGS_QUERY);
}

export async function getArticles() {
    return client.fetch<SanityArticle[]>(ARTICLES_QUERY);
}

export async function getArticleBySlug(slug: string) {
    return client.fetch<SanityArticle | null>(ARTICLE_BY_SLUG_QUERY, { slug });
}

export async function getArticleSlugs() {
    return client.fetch<SlugResult[]>(ARTICLE_SLUGS_QUERY);
}

export async function getGuides() {
    return client.fetch<SanityGuide[]>(GUIDES_QUERY);
}

export async function getGuideBySlug(slug: string) {
    return client.fetch<SanityGuide | null>(GUIDE_BY_SLUG_QUERY, { slug });
}

export async function getGuideSlugs() {
    return client.fetch<SlugResult[]>(GUIDE_SLUGS_QUERY);
}
