import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    getArticleBySlug,
    getArticleSlugs,
    getGuideBySlug,
    getGuideSlugs,
    getTravelPackageBySlug,
    getTravelPackageSlugs,
} from "@/sanity/public-content";
import ArticleDetailPage, { dynamicParams as articlesDynamicParams, generateStaticParams as articleStaticParams } from "./articles/[slug]/page";
import GuideDetailPage, { dynamicParams as guidesDynamicParams, generateStaticParams as guideStaticParams } from "./guides/[slug]/page";
import PackageDetailPage, { dynamicParams as packagesDynamicParams, generateStaticParams as packageStaticParams } from "./packages/[slug]/page";

const nextNavigation = vi.hoisted(() => ({
    notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
}));

vi.mock("next/navigation", () => ({ notFound: nextNavigation.notFound }));
vi.mock("@/sanity/public-content", () => ({
    getArticleBySlug: vi.fn(),
    getArticleSlugs: vi.fn(),
    getGuideBySlug: vi.fn(),
    getGuideSlugs: vi.fn(),
    getTravelPackageBySlug: vi.fn(),
    getTravelPackageSlugs: vi.fn(),
}));
vi.mock("@/components/site/EditorialContent", () => ({ EditorialDetail: () => null }));

describe("public editorial detail routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getTravelPackageBySlug).mockResolvedValue(null);
        vi.mocked(getArticleBySlug).mockResolvedValue(null);
        vi.mocked(getGuideBySlug).mockResolvedValue(null);
        vi.mocked(getTravelPackageSlugs).mockResolvedValue([{ slug: "package-slug" }]);
        vi.mocked(getArticleSlugs).mockResolvedValue([{ slug: "article-slug" }]);
        vi.mocked(getGuideSlugs).mockResolvedValue([{ slug: "guide-slug" }]);
    });

    it.each([
        ["package", PackageDetailPage],
        ["article", ArticleDetailPage],
        ["guide", GuideDetailPage],
    ])("returns not-found for a missing published %s", async (_label, page) => {
        await expect(page({ params: Promise.resolve({ slug: "not-published" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("generates published slugs and keeps newly published route params resolvable after build", async () => {
        await expect(packageStaticParams()).resolves.toEqual([{ slug: "package-slug" }]);
        await expect(articleStaticParams()).resolves.toEqual([{ slug: "article-slug" }]);
        await expect(guideStaticParams()).resolves.toEqual([{ slug: "guide-slug" }]);
        expect(packagesDynamicParams).toBe(true);
        expect(articlesDynamicParams).toBe(true);
        expect(guidesDynamicParams).toBe(true);
    });
});
