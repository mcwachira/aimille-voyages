import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { loginAction, logoutAction } from "./actions";

const navigation = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    redirect: (destination: string) => navigation.redirect(destination),
}));

function createFormData(email: string, password: string) {
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    return formData;
}

describe("dashboard authentication actions", () => {
    const signInWithPassword = vi.fn();
    const signOut = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        navigation.redirect.mockImplementation((destination: string) => {
            throw new Error(`REDIRECT:${destination}`);
        });
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: { signInWithPassword, signOut },
        } as never);
        signInWithPassword.mockResolvedValue({ error: null });
        signOut.mockResolvedValue({ error: null });
    });

    it("validates email before calling Supabase", async () => {
        const result = await loginAction(
            { error: "", fieldErrors: {} },
            createFormData("invalid-email", "password"),
        );

        expect(result.fieldErrors.email).toBeTruthy();
        expect(signInWithPassword).not.toHaveBeenCalled();
    });

    it("uses a generic response for invalid credentials", async () => {
        signInWithPassword.mockResolvedValue({ error: new Error("private auth detail") });

        const result = await loginAction(
            { error: "", fieldErrors: {} },
            createFormData("staff@example.test", "wrong-password"),
        );

        expect(result.error).toContain("Email or password is incorrect");
        expect(result.error).not.toContain("private auth detail");
    });

    it("redirects after successful sign-in", async () => {
        await expect(
            loginAction(
                { error: "", fieldErrors: {} },
                createFormData("staff@example.test", "correct-password"),
            ),
        ).rejects.toThrow("REDIRECT:/dashboard");
    });

    it("signs out and redirects to login", async () => {
        await expect(logoutAction({ error: "" }, new FormData())).rejects.toThrow(
            "REDIRECT:/dashboard/login",
        );
        expect(signOut).toHaveBeenCalledOnce();
    });

    it("does not expose sign-out failures", async () => {
        signOut.mockResolvedValue({ error: new Error("private sign-out detail") });

        const result = await logoutAction({ error: "" }, new FormData());
        expect(result.error).toBe("Unable to sign out. Please try again.");
    });
});
