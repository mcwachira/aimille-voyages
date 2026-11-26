import { afterEach, describe, expect, it, vi } from "vitest";

import { getTrustedAppOrigin } from "./trusted-origin";

describe("getTrustedAppOrigin", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("uses the configured local application origin", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000/some/path");
        expect(getTrustedAppOrigin()).toBe("http://localhost:3000");
    });

    it("requires an explicit origin and rejects insecure non-local origins", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
        expect(() => getTrustedAppOrigin()).toThrow("Missing NEXT_PUBLIC_SITE_URL");

        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://example.test");
        expect(() => getTrustedAppOrigin()).toThrow("must be HTTPS");
    });

    it("rejects credentials in the application URL", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://user:password@example.test");
        expect(() => getTrustedAppOrigin()).toThrow("must be HTTPS");
    });

    it("rejects localhost as the configured application origin in production", () => {
        vi.stubEnv("NODE_ENV", "production");
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
        expect(() => getTrustedAppOrigin()).toThrow("must be HTTPS");
    });
});
