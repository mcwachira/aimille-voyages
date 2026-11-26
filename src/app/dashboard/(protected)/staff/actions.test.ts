import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdmin } from "@/lib/auth/require-admin";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { inviteOrAssignAdmin } from "./actions";

const mocks = vi.hoisted(() => ({
    listUsers: vi.fn(),
    inviteUserByEmail: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({
    supabaseAdmin: { auth: { admin: { listUsers: mocks.listUsers, inviteUserByEmail: mocks.inviteUserByEmail } } },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

function form(email: string) {
    const data = new FormData();
    data.set("email", email);
    return data;
}

describe("administrator staff access action", () => {
    const rpc = vi.fn();
    const upsert = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staff.example.test");
        vi.stubEnv("NODE_ENV", "test");
        vi.mocked(requireAdmin).mockResolvedValue({
            user: { id: "verified-admin-id" },
            supabase: { rpc, from: vi.fn(() => ({ upsert })) },
        } as never);
        mocks.listUsers.mockResolvedValue({ data: { users: [] }, error: null });
        mocks.inviteUserByEmail.mockResolvedValue({ data: { user: { id: "invited-user-id" } }, error: null });
        rpc.mockResolvedValue({ data: false, error: null });
        upsert.mockResolvedValue({ error: null });
    });

    it("validates email before authorization or privileged Auth calls", async () => {
        const result = await inviteOrAssignAdmin({ status: "idle", message: "" }, form("not-an-email"));

        expect(result.status).toBe("error");
        expect(requireAdmin).not.toHaveBeenCalled();
        expect(supabaseAdmin.auth.admin.listUsers).not.toHaveBeenCalled();
    });

    it("denies direct invocation by a non-admin before user lookup or invitation", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new Error("forbidden"));

        const result = await inviteOrAssignAdmin({ status: "idle", message: "" }, form("staff@example.test"));

        expect(result.status).toBe("error");
        expect(supabaseAdmin.auth.admin.listUsers).not.toHaveBeenCalled();
        expect(supabaseAdmin.auth.admin.inviteUserByEmail).not.toHaveBeenCalled();
    });

    it("invites a new email through Auth and assigns the admin role through the user session", async () => {
        rpc
            .mockResolvedValueOnce({ data: false, error: null })
            .mockResolvedValueOnce({ data: true, error: null });

        const result = await inviteOrAssignAdmin({ status: "idle", message: "" }, form("New.Staff@example.test"));

        expect(supabaseAdmin.auth.admin.inviteUserByEmail).toHaveBeenCalledWith("new.staff@example.test", {
            redirectTo: "https://staff.example.test/auth/callback?flow=invite",
        });
        expect(upsert).toHaveBeenCalledWith(
            { user_id: "invited-user-id", role: "admin" },
            { onConflict: "user_id,role", ignoreDuplicates: true },
        );
        expect(result).toMatchObject({ status: "success" });
    });

    it("does not resend an invitation or duplicate an existing admin role", async () => {
        mocks.listUsers.mockResolvedValue({
            data: { users: [{ id: "existing-admin-id", email: "staff@example.test", email_confirmed_at: "confirmed" }] },
            error: null,
        });
        rpc.mockResolvedValue({ data: true, error: null });

        const result = await inviteOrAssignAdmin({ status: "idle", message: "" }, form("staff@example.test"));

        expect(supabaseAdmin.auth.admin.inviteUserByEmail).not.toHaveBeenCalled();
        expect(upsert).not.toHaveBeenCalled();
        expect(result.message).toContain("already");
    });

    it("assigns admin access to an existing invited account without sending another email", async () => {
        mocks.listUsers.mockResolvedValue({
            data: { users: [{ id: "pending-user-id", email: "staff@example.test", invited_at: "pending" }] },
            error: null,
        });
        rpc
            .mockResolvedValueOnce({ data: false, error: null })
            .mockResolvedValueOnce({ data: true, error: null });

        const result = await inviteOrAssignAdmin({ status: "idle", message: "" }, form("staff@example.test"));

        expect(supabaseAdmin.auth.admin.inviteUserByEmail).not.toHaveBeenCalled();
        expect(upsert).toHaveBeenCalledWith(
            { user_id: "pending-user-id", role: "admin" },
            { onConflict: "user_id,role", ignoreDuplicates: true },
        );
        expect(result.message).toContain("existing invitation");
    });

    it("does not claim success if the role insert failed and the role is still absent", async () => {
        upsert.mockResolvedValue({ error: new Error("RLS denied or unique constraint unavailable") });
        rpc
            .mockResolvedValueOnce({ data: false, error: null })
            .mockResolvedValueOnce({ data: false, error: null });

        const result = await inviteOrAssignAdmin({ status: "idle", message: "" }, form("new@example.test"));

        expect(result.status).toBe("error");
        expect(result.message).toContain("invitation was sent");
    });
});
