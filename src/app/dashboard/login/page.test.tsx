import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminAuthorizationError, requireAdmin } from "@/lib/auth/require-admin";
import DashboardLoginPage from "./page";

const navigation = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("@/lib/auth/require-admin", () => ({
    AdminAuthorizationError: class extends Error { constructor(readonly reason: string) { super("no access"); } },
    requireAdmin: vi.fn(),
}));
vi.mock("@/integrations/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock("next/navigation", () => ({
    redirect: (destination: string) => navigation.redirect(destination),
}));

describe("DashboardLoginPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        navigation.redirect.mockImplementation((destination: string) => {
            throw new Error(`REDIRECT:${destination}`);
        });
    });

    it("redirects authenticated administrators to the dashboard", async () => {
        vi.mocked(requireAdmin).mockResolvedValue({ user: { id: "admin" }, supabase: {} } as never);

        await expect(DashboardLoginPage()).rejects.toThrow("REDIRECT:/dashboard");
    });

    it("keeps the login page available when staff access is not verified", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new AdminAuthorizationError("unauthenticated"));

        const markup = renderToStaticMarkup(await DashboardLoginPage());
        expect(markup).toContain("Welcome back.");
    });

    it("sends authenticated non-admins to the unauthorized page", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new AdminAuthorizationError("forbidden"));
        await expect(DashboardLoginPage()).rejects.toThrow("REDIRECT:/dashboard/unauthorized");
    });
});
