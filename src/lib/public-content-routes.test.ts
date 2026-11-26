import { describe, expect, it } from "vitest";

import { editorialDetailPath, PUBLIC_CONTENT_ROUTES } from "./public-content-routes";

describe("editorial public routes", () => {
    it("defines the public listing paths", () => {
        expect(PUBLIC_CONTENT_ROUTES.packages.path).toBe("/packages");
        expect(PUBLIC_CONTENT_ROUTES.articles.path).toBe("/articles");
        expect(PUBLIC_CONTENT_ROUTES.guides.path).toBe("/guides");
    });

    it("encodes content slugs in detail links and canonical paths", () => {
        expect(editorialDetailPath("packages", "kenya safari / coast")).toBe("/packages/kenya%20safari%20%2F%20coast");
        expect(editorialDetailPath("articles", "journey-notes")).toBe("/articles/journey-notes");
        expect(editorialDetailPath("guides", "travel-guide")).toBe("/guides/travel-guide");
    });
});
