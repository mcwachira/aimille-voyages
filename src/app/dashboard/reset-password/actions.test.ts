import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { resetPasswordAction } from "./actions";

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));

function createFormData(password: string, confirmPassword: string) {
    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    return formData;
}

describe("resetPasswordAction", () => {
    const getUser = vi.fn();
    const updateUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: { getUser, updateUser },
        } as never);
        getUser.mockResolvedValue({ data: { user: { id: "verified-user" } }, error: null });
        updateUser.mockResolvedValue({ error: null });
    });

    it("rejects mismatched passwords before updating the account", async () => {
        const result = await resetPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("secure-password", "different-password"),
        );

        expect(result.fieldErrors.confirmPassword).toBe("Passwords do not match.");
        expect(updateUser).not.toHaveBeenCalled();
    });

    it("rejects a password that does not meet the minimum length", async () => {
        const result = await resetPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("short", "short"),
        );

        expect(result.fieldErrors.password).toBeTruthy();
        expect(updateUser).not.toHaveBeenCalled();
    });

    it("updates the password only after verifying the authenticated user", async () => {
        const result = await resetPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("secure-password", "secure-password"),
        );

        expect(getUser).toHaveBeenCalledOnce();
        expect(updateUser).toHaveBeenCalledWith({ password: "secure-password" });
        expect(result.status).toBe("success");
    });

    it("handles expired sessions without attempting an update or exposing details", async () => {
        getUser.mockResolvedValue({
            data: { user: null },
            error: new Error("private expired-token detail"),
        });

        const result = await resetPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("secure-password", "secure-password"),
        );

        expect(result.status).toBe("expired");
        expect(result.message).toContain("expired");
        expect(result.message).not.toContain("private expired-token detail");
        expect(updateUser).not.toHaveBeenCalled();
    });
});
