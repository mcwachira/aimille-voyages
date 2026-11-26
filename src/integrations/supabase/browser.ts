import "client-only";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/integrations/supabase/types";

function getRequiredPublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

export function createSupabaseBrowserClient() {
    return createBrowserClient<Database>(
        getRequiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
        getRequiredPublicEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
        { cookieOptions: { secure: process.env.NODE_ENV === "production" } },
    );
}
