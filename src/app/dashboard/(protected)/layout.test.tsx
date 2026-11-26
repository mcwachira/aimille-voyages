import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminAuthorizationError, requireAdmin } from "@/lib/auth/require-admin";
import ProtectedDashboardLayout from "./layout";

const navigation = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("@/lib/auth/require-admin", () => ({
    AdminAuthorizationError: class extends Error { constructor(readonly reason: string) { super("no access"); } },
    requireAdmin: vi.fn(),
}));
vi.mock("@/integrations/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock("next/navigation", () => ({
    redirect: (destination: string) => navigation.redirect(destination),
}));

describe("ProtectedDashboardLayout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        navigation.redirect.mockImplementation((destination: string) => {
            throw new Error(`REDIRECT:${destination}`);
        });
    });

    it("redirects unauthenticated users to login", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new AdminAuthorizationError("unauthenticated"));

        await expect(ProtectedDashboardLayout({ children: "protected" })).rejects.toThrow(
            "REDIRECT:/dashboard/login",
        );
    });

    it("fails closed when admin authorization cannot be verified", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new AdminAuthorizationError("unavailable"));

        await expect(ProtectedDashboardLayout({ children: "protected" })).rejects.toThrow(
            "REDIRECT:/dashboard/unauthorized",
        );
    });

    it("denies an authenticated user without the admin role", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new AdminAuthorizationError("forbidden"));

        await expect(ProtectedDashboardLayout({ children: "protected" })).rejects.toThrow(
            "REDIRECT:/dashboard/unauthorized",
        );
    });
});
