import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { forgotPasswordAction } from "./actions";

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));

function createFormData(email: string) {
    const formData = new FormData();
    formData.set("email", email);
    return formData;
}

describe("forgotPasswordAction", () => {
    const resetPasswordForEmail = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staff.example.test");
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: { resetPasswordForEmail },
        } as never);
        resetPasswordForEmail.mockResolvedValue({ error: null });
    });

    afterEach(() => vi.restoreAllMocks());

    it("rejects an invalid email without contacting Supabase", async () => {
        const result = await forgotPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("not-an-email"),
        );

        expect(result.status).toBe("error");
        expect(result.fieldErrors.email).toBeTruthy();
        expect(resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it("returns the same generic success message when recovery is accepted", async () => {
        const result = await forgotPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("staff@example.test"),
        );

        expect(result).toEqual({
            status: "success",
            message:
                "If an account matches that email address, recovery instructions will be sent.",
            fieldErrors: {},
        });
        expect(resetPasswordForEmail).toHaveBeenCalledWith("staff@example.test", {
            redirectTo: "https://staff.example.test/auth/callback",
        });
    });

    it("does not expose Supabase errors", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
        resetPasswordForEmail.mockResolvedValue({
            error: Object.assign(new Error("private provider detail"), {
                status: 429,
                code: "over_email_send_rate_limit",
            }),
        });

        const result = await forgotPasswordAction(
            { status: "idle", message: "", fieldErrors: {} },
            createFormData("staff@example.test"),
        );

        expect(result.message).not.toContain("private provider detail");
        expect(result.status).toBe("error");
        expect(JSON.stringify(log.mock.calls)).not.toContain("private provider detail");
        expect(JSON.stringify(log.mock.calls)).toContain("over_email_send_rate_limit");
    });
});
