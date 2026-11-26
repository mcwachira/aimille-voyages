import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Supabase credential boundaries", () => {
    it("keeps the browser client limited to public environment variables", () => {
        const browserClient = readFileSync(resolve(process.cwd(), "src/integrations/supabase/browser.ts"), "utf8");

        expect(browserClient).toContain("NEXT_PUBLIC_SUPABASE_URL");
        expect(browserClient).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
        expect(browserClient).not.toContain("SUPABASE_SECRET_KEY");
        expect(browserClient).not.toContain("SANITY_API_WRITE_TOKEN");
    });

    it("marks privileged clients as server-only", () => {
        const supabaseClient = readFileSync(resolve(process.cwd(), "src/integrations/supabase/client.server.ts"), "utf8");
        const sanityClient = readFileSync(resolve(process.cwd(), "src/lib/dashboard/content/sanity-server.ts"), "utf8");

        expect(supabaseClient).toContain('import "server-only";');
        expect(supabaseClient).toContain("SUPABASE_SECRET_KEY");
        expect(sanityClient).toContain('import "server-only";');
        expect(sanityClient).toContain("SANITY_API_WRITE_TOKEN");
    });
});
