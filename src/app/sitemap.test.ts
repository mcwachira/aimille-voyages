import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { client } from "@/sanity/lib/client";
import { getArticleSlugs, getGuideSlugs, getTravelPackageSlugs } from "@/sanity/public-content";
import sitemap from "./sitemap";

vi.mock("@/sanity/lib/client", () => ({ client: { fetch: vi.fn() } }));
vi.mock("@/sanity/public-content", () => ({
    getArticleSlugs: vi.fn(),
    getGuideSlugs: vi.fn(),
    getTravelPackageSlugs: vi.fn(),
}));

describe("public sitemap editorial routes", () => {
    beforeEach(() => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://voyages.example.test/base-path");
        vi.clearAllMocks();
        vi.mocked(client.fetch).mockResolvedValue([] as never);
        vi.mocked(getTravelPackageSlugs).mockResolvedValue([{ slug: "coast-escape" }]);
        vi.mocked(getArticleSlugs).mockResolvedValue([{ slug: "packing-for-kenya" }]);
        vi.mocked(getGuideSlugs).mockResolvedValue([{ slug: "first-time-safari" }]);
    });

    afterEach(() => vi.unstubAllEnvs());

    it("includes editorial listings and published document detail URLs", async () => {
        const entries = await sitemap();
        const urls = entries.map(({ url }) => url);

        expect(urls).toContain("https://voyages.example.test/packages");
        expect(urls).toContain("https://voyages.example.test/packages/coast-escape");
        expect(urls).toContain("https://voyages.example.test/articles");
        expect(urls).toContain("https://voyages.example.test/articles/packing-for-kenya");
        expect(urls).toContain("https://voyages.example.test/guides");
        expect(urls).toContain("https://voyages.example.test/guides/first-time-safari");
        expect(urls.every((url) => !url.includes("aimillevoyages.com"))).toBe(true);
    });
});
