import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { GET } from "./route";

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));

describe("Supabase auth callback", () => {
    const exchangeCodeForSession = vi.fn();
    const verifyOtp = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staff.example.test");
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: { exchangeCodeForSession, verifyOtp },
        } as never);
    });

    it("routes fragment-based email tokens to the same-origin fragment handler", async () => {
        const response = await GET(
            new NextRequest("https://untrusted.example/auth/callback"),
        );

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/auth/callback/fragment",
        );
        expect(exchangeCodeForSession).not.toHaveBeenCalled();
        expect(verifyOtp).not.toHaveBeenCalled();
    });

    it("redirects failed exchanges without exposing auth details", async () => {
        exchangeCodeForSession.mockResolvedValue({
            error: new Error("private exchange detail"),
        });

        const response = await GET(
            new NextRequest("https://untrusted.example/auth/callback?code=one-time-code"),
        );

        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/forgot-password?error=recovery",
        );
        expect(response.headers.get("location")).not.toContain("one-time-code");
        expect(response.headers.get("location")).not.toContain("private exchange detail");
    });

    it("exchanges a code and redirects to the fixed reset-password route", async () => {
        exchangeCodeForSession.mockResolvedValue({ error: null });

        const response = await GET(
            new NextRequest("https://untrusted.example/auth/callback?code=one-time-code&next=https://evil.test"),
        );

        expect(exchangeCodeForSession).toHaveBeenCalledWith("one-time-code");
        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/reset-password",
        );
    });

    it("uses only the fixed invitation acceptance destination for invitation flows", async () => {
        exchangeCodeForSession.mockResolvedValue({ error: null });

        const response = await GET(
            new NextRequest(
                "https://untrusted.example/auth/callback?code=invite-code&flow=invite&next=https://evil.test",
            ),
        );

        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/accept-invitation",
        );
    });

    it("uses a fixed invitation error state for invalid or expired invite codes", async () => {
        exchangeCodeForSession.mockResolvedValue({ error: new Error("private invite detail") });

        const response = await GET(
            new NextRequest(
                "https://untrusted.example/auth/callback?code=expired-code&flow=invite",
            ),
        );

        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/accept-invitation?error=invite",
        );
        expect(response.headers.get("location")).not.toContain("private invite detail");
    });

    it("verifies an invitation token hash server-side and redirects to password setup", async () => {
        verifyOtp.mockResolvedValue({ error: null });

        const response = await GET(new NextRequest(
            "https://untrusted.example/auth/callback?token_hash=one-time-hash&type=invite&next=https://evil.test",
        ));

        expect(verifyOtp).toHaveBeenCalledWith({ token_hash: "one-time-hash", type: "invite" });
        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/accept-invitation",
        );
        expect(response.headers.get("location")).not.toContain("one-time-hash");
    });

    it("supports token-hash recovery templates without accepting arbitrary OTP types", async () => {
        verifyOtp.mockResolvedValue({ error: null });

        const response = await GET(new NextRequest(
            "https://untrusted.example/auth/callback?token_hash=recovery-hash&type=recovery&flow=invite",
        ));

        expect(verifyOtp).toHaveBeenCalledWith({ token_hash: "recovery-hash", type: "recovery" });
        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/reset-password",
        );
    });

    it("does not exchange unsupported OTP types", async () => {
        const response = await GET(new NextRequest(
            "https://untrusted.example/auth/callback?token_hash=hash&type=signup",
        ));

        expect(response.headers.get("location")).toBe(
            "https://staff.example.test/dashboard/forgot-password?error=recovery",
        );
        expect(verifyOtp).not.toHaveBeenCalled();
    });

    it("does not redirect to an application origin when trusted origin configuration is missing", async () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

        const response = await GET(
            new NextRequest("https://untrusted.example/auth/callback?code=code"),
        );

        expect(response.status).toBe(503);
        expect(response.headers.get("location")).toBeNull();
        expect(exchangeCodeForSession).not.toHaveBeenCalled();
    });
});
