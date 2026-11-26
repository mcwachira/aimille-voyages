import { beforeEach, describe, expect, it, vi } from "vitest";

import { client } from "@/sanity/lib/client";
import {
    ARTICLE_BY_SLUG_QUERY,
    ARTICLE_SLUGS_QUERY,
    ARTICLES_QUERY,
    GUIDE_BY_SLUG_QUERY,
    GUIDE_SLUGS_QUERY,
    GUIDES_QUERY,
    TRAVEL_PACKAGE_BY_SLUG_QUERY,
    TRAVEL_PACKAGE_SLUGS_QUERY,
    TRAVEL_PACKAGES_QUERY,
    getArticleBySlug,
    getArticleSlugs,
    getArticles,
    getGuideBySlug,
    getGuideSlugs,
    getGuides,
    getTravelPackageBySlug,
    getTravelPackageSlugs,
    getTravelPackages,
} from "./public-content";

vi.mock("@/sanity/lib/client", () => ({ client: { fetch: vi.fn() } }));

const contentQueries = [
    TRAVEL_PACKAGES_QUERY,
    TRAVEL_PACKAGE_BY_SLUG_QUERY,
    TRAVEL_PACKAGE_SLUGS_QUERY,
    ARTICLES_QUERY,
    ARTICLE_BY_SLUG_QUERY,
    ARTICLE_SLUGS_QUERY,
    GUIDES_QUERY,
    GUIDE_BY_SLUG_QUERY,
    GUIDE_SLUGS_QUERY,
];

describe("public Sanity content queries", () => {
    beforeEach(() => vi.clearAllMocks());

    it("limits every package, article and guide query to published documents with slugs", () => {
        for (const query of contentQueries) {
            expect(String(query)).toContain("!(_id in path(\"drafts.**\"))");
            expect(String(query)).toContain("defined(slug.current)");
        }
    });

    it("projects package and guide relationships using the existing destination and experience references", () => {
        for (const query of [TRAVEL_PACKAGE_BY_SLUG_QUERY, GUIDE_BY_SLUG_QUERY]) {
            expect(String(query)).toContain('"destinations": destinations[]->');
            expect(String(query)).toContain('"experiences": experiences[]->');
        }
    });

    it("passes detail slugs as query parameters and returns the Sanity result", async () => {
        const expected = { title: "A journey", slug: "a-journey" };
        vi.mocked(client.fetch).mockResolvedValue(expected as never);

        await expect(getTravelPackageBySlug("a-journey")).resolves.toBe(expected);
        expect(client.fetch).toHaveBeenCalledWith(TRAVEL_PACKAGE_BY_SLUG_QUERY, { slug: "a-journey" });
        await getArticleBySlug("story");
        expect(client.fetch).toHaveBeenLastCalledWith(ARTICLE_BY_SLUG_QUERY, { slug: "story" });
        await getGuideBySlug("guide");
        expect(client.fetch).toHaveBeenLastCalledWith(GUIDE_BY_SLUG_QUERY, { slug: "guide" });
    });

    it("uses the matching list and published-slug query for every content type", async () => {
        vi.mocked(client.fetch).mockResolvedValue([] as never);
        await getTravelPackages();
        expect(client.fetch).toHaveBeenLastCalledWith(TRAVEL_PACKAGES_QUERY);
        await getTravelPackageSlugs();
        expect(client.fetch).toHaveBeenLastCalledWith(TRAVEL_PACKAGE_SLUGS_QUERY);
        await getArticles();
        expect(client.fetch).toHaveBeenLastCalledWith(ARTICLES_QUERY);
        await getArticleSlugs();
        expect(client.fetch).toHaveBeenLastCalledWith(ARTICLE_SLUGS_QUERY);
        await getGuides();
        expect(client.fetch).toHaveBeenLastCalledWith(GUIDES_QUERY);
        await getGuideSlugs();
        expect(client.fetch).toHaveBeenLastCalledWith(GUIDE_SLUGS_QUERY);
    });
});
