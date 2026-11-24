import type { MetadataRoute } from "next";

import { SERVICES } from "@/content/services";
import { client } from "@/sanity/lib/client";
import { DESTINATIONS_QUERY, EXPERIENCES_QUERY } from "@/sanity/queries";
import type { SanityDestination, SanityExperience } from "@/sanity/types";

const SITE_URL = "https://aimillevoyages.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [destinations, experiences] = await Promise.all([
        client.fetch(DESTINATIONS_QUERY) as Promise<SanityDestination[]>,
        client.fetch(EXPERIENCES_QUERY) as Promise<SanityExperience[]>,
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
        "/long-stay",
        "/contact",
        "/plan-your-trip",
        "/privacy",
        "/cookies",
    ];

    return [
        ...staticRoutes.map((path) => ({ url: `${SITE_URL}${path}` })),
        ...destinations.map((destination) => ({
            url: `${SITE_URL}/destinations/${destination.slug}`,
        })),
        ...experiences.map((experience) => ({
            url: `${SITE_URL}/experiences/${experience.slug}`,
        })),
    ];
}
