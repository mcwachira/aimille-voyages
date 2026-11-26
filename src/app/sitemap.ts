import type { MetadataRoute } from "next";

import { SERVICES } from "@/content/services";
import { client } from "@/sanity/lib/client";
import { DESTINATIONS_QUERY, EXPERIENCES_QUERY } from "@/sanity/queries";
import { getArticleSlugs, getGuideSlugs, getTravelPackageSlugs } from "@/sanity/public-content";
import type { SanityDestination, SanityExperience } from "@/sanity/types";
import { editorialDetailPath, PUBLIC_CONTENT_ROUTES } from "@/lib/public-content-routes";
import { getPublicSiteOrigin } from "@/lib/site-origin";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteOrigin = getPublicSiteOrigin();
    const [destinations, experiences, packages, articles, guides] = await Promise.all([
        client.fetch(DESTINATIONS_QUERY) as Promise<SanityDestination[]>,
        client.fetch(EXPERIENCES_QUERY) as Promise<SanityExperience[]>,
        getTravelPackageSlugs(),
        getArticleSlugs(),
        getGuideSlugs(),
    ]);

    const staticRoutes = [
        "/",
        "/about",
        "/services",
        ...SERVICES
            .filter((service) => service.slug !== "long-stay")
            .map((service) => `/services/${service.slug}`),
        "/destinations",
        "/experiences",
        PUBLIC_CONTENT_ROUTES.packages.path,
        PUBLIC_CONTENT_ROUTES.articles.path,
        PUBLIC_CONTENT_ROUTES.guides.path,
        "/long-stay",
        "/contact",
        "/plan-your-trip",
        "/privacy",
        "/cookies",
    ];

    return [
        ...staticRoutes.map((path) => ({ url: `${siteOrigin}${path}` })),
        ...destinations.map((destination) => ({
            url: `${siteOrigin}/destinations/${destination.slug}`,
        })),
        ...experiences.map((experience) => ({
            url: `${siteOrigin}/experiences/${experience.slug}`,
        })),
        ...packages.map(({ slug }) => ({ url: `${siteOrigin}${editorialDetailPath("packages", slug)}` })),
        ...articles.map(({ slug }) => ({ url: `${siteOrigin}${editorialDetailPath("articles", slug)}` })),
        ...guides.map(({ slug }) => ({ url: `${siteOrigin}${editorialDetailPath("guides", slug)}` })),
    ];
}
