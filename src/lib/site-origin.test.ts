import { afterEach, describe, expect, it, vi } from "vitest";

import { getPublicSiteOrigin } from "./site-origin";

describe("getPublicSiteOrigin", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("uses the configured host and removes any path", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://voyages.example.test/path");
        expect(getPublicSiteOrigin()).toBe("https://voyages.example.test");
    });

    it("allows the local development origin", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
        expect(getPublicSiteOrigin()).toBe("http://localhost:3000");
    });

    it.each([
        "",
        "http://voyages.example.test",
        "https://user:password@voyages.example.test",
        "javascript:alert(1)",
    ])("rejects an unsafe or missing origin (%s)", (origin) => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
        expect(() => getPublicSiteOrigin()).toThrow();
    });
});
