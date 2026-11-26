import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import ResetPasswordPage from "./page";

vi.mock("@/integrations/supabase/server", () => ({
    createSupabaseServerClient: vi.fn(),
}));

describe("ResetPasswordPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a safe recovery error and retry link without an authenticated session", async () => {
        vi.mocked(createSupabaseServerClient).mockResolvedValue({
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
            },
        } as never);

        const markup = renderToStaticMarkup(await ResetPasswordPage());

        expect(markup).toContain("This recovery session is missing or has expired.");
        expect(markup).toContain('href="/dashboard/forgot-password"');
        expect(markup).not.toContain("internal");
    });
});
