import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionMissingError } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { AdminAuthorizationError, requireAdmin } from "./require-admin";

vi.mock("server-only", () => ({}));
vi.mock("@/integrations/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

describe("requireAdmin", () => {
    const getUser = vi.fn();
    const rpc = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(createSupabaseServerClient).mockResolvedValue({ auth: { getUser }, rpc } as never);
    });

    it.each([
        ["mcwachira@outlook.com", "existing-admin-id"],
        ["aimillevoyages@gmail.com", "second-admin-id"],
    ])("applies the same admin role check to %s", async (email, id) => {
        getUser.mockResolvedValue({ data: { user: { id, email } }, error: null });
        rpc.mockResolvedValue({ data: true, error: null });

        const result = await requireAdmin();

        expect(result.user).toMatchObject({ id, email });
        expect(rpc).toHaveBeenCalledWith("has_role", { _role: "admin", _user_id: id });
    });

    it("denies an authenticated user without the admin role", async () => {
        getUser.mockResolvedValue({ data: { user: { id: "editor-id" } }, error: null });
        rpc.mockResolvedValue({ data: false, error: null });

        await expect(requireAdmin()).rejects.toMatchObject<Partial<AdminAuthorizationError>>({ reason: "forbidden" });
    });

    it("denies an unauthenticated request without querying a role", async () => {
        getUser.mockResolvedValue({ data: { user: null }, error: null });

        await expect(requireAdmin()).rejects.toMatchObject({ reason: "unauthenticated" });
        expect(rpc).not.toHaveBeenCalled();
    });

    it("classifies Supabase's missing-session error as unauthenticated", async () => {
        getUser.mockResolvedValue({ data: { user: null }, error: new AuthSessionMissingError() });

        await expect(requireAdmin()).rejects.toMatchObject({ reason: "unauthenticated" });
        expect(rpc).not.toHaveBeenCalled();
    });

    it("fails closed when identity or role verification returns an error", async () => {
        getUser.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });
        rpc.mockResolvedValue({ data: true, error: new Error("database unavailable") });

        await expect(requireAdmin()).rejects.toMatchObject({ reason: "unavailable" });

        getUser.mockResolvedValue({ data: { user: null }, error: new Error("invalid session") });
        await expect(requireAdmin()).rejects.toMatchObject({ reason: "unavailable" });
    });
});
