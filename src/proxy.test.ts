import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const supabaseMock = vi.hoisted(() => ({ createServerClient: vi.fn() }));

vi.mock("@supabase/ssr", () => supabaseMock);

import { proxy } from "./proxy";

describe("Supabase session proxy", () => {
    const getClaims = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.example.test");
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable-test-key");
        getClaims.mockResolvedValue({ data: { claims: null }, error: null });
        supabaseMock.createServerClient.mockImplementation((_url, _key, options) => {
            options.cookies.setAll([
                {
                    name: "sb-test-auth-token",
                    value: "refreshed-test-session",
                    options: { httpOnly: true, path: "/" },
                },
            ]);
            return { auth: { getClaims } };
        });
    });

    it("verifies session claims and propagates refreshed cookies", async () => {
        const request = new NextRequest("http://localhost:3000/dashboard");
        const response = await proxy(request);

        expect(getClaims).toHaveBeenCalledOnce();
        expect(request.cookies.get("sb-test-auth-token")?.value).toBe(
            "refreshed-test-session",
        );
        expect(response.cookies.get("sb-test-auth-token")?.value).toBe(
            "refreshed-test-session",
        );
    });
});
