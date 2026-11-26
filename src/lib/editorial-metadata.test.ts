import { describe, expect, it } from "vitest";

import { editorialMetadata } from "./editorial-metadata";

describe("editorial metadata", () => {
    it("uses configured SEO fields, canonical route and Sanity image for social cards", () => {
        const metadata = editorialMetadata({
            title: "Safari journal",
            description: "Default summary",
            seo: { metaTitle: "Custom SEO title", metaDescription: "Custom search description" },
            canonical: "/articles/safari-journal",
            image: { asset: { url: "https://cdn.sanity.io/images/project/dataset/article.jpg" } },
        });

        expect(metadata.title).toBe("Custom SEO title");
        expect(metadata.description).toBe("Custom search description");
        expect(metadata.alternates?.canonical).toBe("/articles/safari-journal");
        expect(metadata.openGraph?.url).toBe("/articles/safari-journal");
        expect(metadata.openGraph?.images).toEqual([{ url: "https://cdn.sanity.io/images/project/dataset/article.jpg", alt: "Safari journal" }]);
    });

    it("falls back to the content title and summary when SEO fields are absent", () => {
        const metadata = editorialMetadata({ title: "A guide", description: "A useful guide.", canonical: "/guides/a-guide" });
        expect(metadata.title).toBe("A guide | AIMILLE VOYAGES");
        expect(metadata.description).toBe("A useful guide.");
        expect(metadata.twitter).toMatchObject({ card: "summary" });
    });
});
