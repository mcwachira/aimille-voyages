import type { MetadataRoute } from "next";

import { getPublicSiteOrigin } from "@/lib/site-origin";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/dashboard", "/auth/callback", "/studio/"],
        },
        sitemap: `${getPublicSiteOrigin()}/sitemap.xml`,
    };
}
