import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "./server";

const mocks = vi.hoisted(() => ({
    createServerClient: vi.fn(),
    cookies: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));

describe("createSupabaseServerClient cookie security", () => {
    beforeEach(() => {
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://uvnyfqwhygxvxfkmunlv.supabase.co");
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "public-test-key");
        mocks.cookies.mockResolvedValue({ getAll: () => [], set: vi.fn() });
        mocks.createServerClient.mockReturnValue({});
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.clearAllMocks();
    });

    it("marks auth cookies secure for production HTTPS deployments", async () => {
        vi.stubEnv("NODE_ENV", "production");

        await createSupabaseServerClient();

        expect(mocks.createServerClient).toHaveBeenCalledWith(
            "https://uvnyfqwhygxvxfkmunlv.supabase.co",
            "public-test-key",
            expect.objectContaining({ cookieOptions: { secure: true } }),
        );
    });

    it("keeps local development cookies usable over localhost HTTP", async () => {
        vi.stubEnv("NODE_ENV", "development");

        await createSupabaseServerClient();

        expect(mocks.createServerClient).toHaveBeenCalledWith(
            "https://uvnyfqwhygxvxfkmunlv.supabase.co",
            "public-test-key",
            expect.objectContaining({ cookieOptions: { secure: false } }),
        );
    });
});
