
import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
    throw new Error("Missing SUPABASE_URL environment variable.");
}

if (!secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY environment variable.");
}

export const supabaseAdmin = createClient<Database>(
    supabaseUrl,
    secretKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    },
);
