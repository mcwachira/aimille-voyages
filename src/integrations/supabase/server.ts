import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/integrations/supabase/types";

function getRequiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function isReadOnlyCookiesError(error: unknown): boolean {
    return (
        error instanceof Error &&
        error.message.startsWith(
            "Cookies can only be modified in a Server Action or Route Handler.",
        )
    );
}

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
        getRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
        {
            cookieOptions: { secure: process.env.NODE_ENV === "production" },
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (error) {
                        // Server Components expose read-only cookies. Let other errors propagate.
                        if (!isReadOnlyCookiesError(error)) {
                            throw error;
                        }
                    }
                },
            },
        },
    );
}
