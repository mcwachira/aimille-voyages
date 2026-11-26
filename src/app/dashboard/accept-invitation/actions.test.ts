import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { acceptInvitationAction } from "./actions";

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));

function createFormData(password: string, confirmPassword: string) {
    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    return formData;
}

describe("acceptInvitationAction", () => {
    const getUser = vi.fn();
    const updateUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: { getUser, updateUser },
        } as never);
        getUser.mockResolvedValue({
            data: { user: { id: "invitee", invited_at: "2026-11-26T00:00:00Z" } },
            error: null,
        });
        updateUser.mockResolvedValue({ error: null });
    });

    it("sets a password only for a verified invited account", async () => {
        const result = await acceptInvitationAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("secure-password", "secure-password"),
        );

        expect(getUser).toHaveBeenCalledOnce();
        expect(updateUser).toHaveBeenCalledWith({ password: "secure-password" });
        expect(result.status).toBe("success");
    });

    it("rejects expired or non-invitation sessions", async () => {
        getUser.mockResolvedValue({ data: { user: { id: "ordinary-user" } }, error: null });

        const result = await acceptInvitationAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("secure-password", "secure-password"),
        );

        expect(result.status).toBe("expired");
        expect(updateUser).not.toHaveBeenCalled();
    });

    it("rejects mismatched passwords", async () => {
        const result = await acceptInvitationAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("secure-password", "different-password"),
        );

        expect(result.fieldErrors.confirmPassword).toBe("Passwords do not match.");
        expect(getUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalled();
    });
});
