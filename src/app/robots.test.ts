import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "./robots";

describe("robots metadata", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("points crawlers to the configured sitemap origin", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://voyages.example.test/app");

        expect(robots().sitemap).toBe("https://voyages.example.test/sitemap.xml");
        expect(robots().rules).toMatchObject({
            userAgent: "*",
            allow: "/",
            disallow: ["/dashboard", "/auth/callback", "/studio/"],
        });
    });

    it("fails clearly when the public origin is not configured", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

        expect(() => robots()).toThrow("Missing NEXT_PUBLIC_SITE_URL");
    });
});
