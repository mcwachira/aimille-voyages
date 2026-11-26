import "server-only";

import { isAuthSessionMissingError, type User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

export type AdminAuthorizationFailure = "unauthenticated" | "forbidden" | "unavailable";

export class AdminAuthorizationError extends Error {
    constructor(readonly reason: AdminAuthorizationFailure) {
        super("Administrator access could not be verified.");
        this.name = "AdminAuthorizationError";
    }
}

export async function requireAdmin() {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.getUser();

        if (error && isAuthSessionMissingError(error)) {
            throw new AdminAuthorizationError("unauthenticated");
        }

        if (error) {
            throw new AdminAuthorizationError("unavailable");
        }

        const user = data.user;
        if (!user) {
            throw new AdminAuthorizationError("unauthenticated");
        }

        const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
            _role: "admin",
            _user_id: user.id,
        });

        if (roleError) {
            throw new AdminAuthorizationError("unavailable");
        }

        if (isAdmin !== true) {
            throw new AdminAuthorizationError("forbidden");
        }

        return { supabase, user: user as User };
    } catch (error) {
        if (error instanceof AdminAuthorizationError) {
            throw error;
        }

        throw new AdminAuthorizationError("unavailable");
    }
}
