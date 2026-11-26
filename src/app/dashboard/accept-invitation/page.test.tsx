import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import AcceptInvitationPage from "./page";

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));

describe("AcceptInvitationPage", () => {
    beforeEach(() => vi.clearAllMocks());

    it("shows password setup only for a verified authenticated invitation session", async () => {
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: { id: "verified-invitee", invited_at: "2026-11-26T00:00:00Z" } }, error: null }),
            },
        } as never);

        const markup = renderToStaticMarkup(
            await AcceptInvitationPage({ searchParams: Promise.resolve({}) }),
        );

        expect(markup).toContain("Set your password.");
        expect(markup).toContain('name="password"');
    });

    it("rejects expired invitations without exposing auth internals", async () => {
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: { id: "ordinary-user" } }, error: null }),
            },
        } as never);

        const markup = renderToStaticMarkup(
            await AcceptInvitationPage({ searchParams: Promise.resolve({}) }),
        );

        expect(markup).toContain("This invitation is invalid, expired, or already used.");
        expect(markup).not.toContain("private auth detail");
        expect(markup).not.toContain('name="password"');
    });
});
