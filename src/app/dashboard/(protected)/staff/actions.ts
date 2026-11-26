"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getTrustedAppOrigin } from "@/lib/auth/trusted-origin";
import { requireAdmin } from "@/lib/auth/require-admin";

export type StaffActionState = {
    status: "idle" | "success" | "error";
    message: string;
};

const inviteSchema = z.object({
    email: z.string().trim().email("Enter a valid email address.").max(254).transform((email) => email.toLowerCase()),
});

type AuthUser = {
    id: string;
    email?: string;
    email_confirmed_at?: string;
    invited_at?: string;
};

async function findAuthUserByEmail(email: string): Promise<AuthUser | null | "unavailable"> {
    for (let page = 1; page <= 100; page += 1) {
        let data: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.listUsers>>["data"];
        try {
            const result = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
            if (result.error) return "unavailable";
            data = result.data;
        } catch {
            return "unavailable";
        }

        const existing = data.users.find((user) => user.email?.toLowerCase() === email);
        if (existing) return existing;
        if (data.users.length < 1000) return null;
    }

    return "unavailable";
}

async function assignAdminRole(userId: string, supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]): Promise<"already" | "assigned" | false> {
    try {
        const current = await supabase.rpc("has_role", { _role: "admin", _user_id: userId });
        if (current.error) return false;
        if (current.data === true) return "already";

        // The explicit conflict target makes concurrent assignments idempotent;
        // without the matching live unique constraint Supabase rejects the write.
        const assigned = await supabase.from("user_roles").upsert(
            { user_id: userId, role: "admin" },
            { onConflict: "user_id,role", ignoreDuplicates: true },
        );
        if (assigned.error) return false;

        const verified = await supabase.rpc("has_role", { _role: "admin", _user_id: userId });
        return !verified.error && verified.data === true ? "assigned" : false;
    } catch {
        return false;
    }
}

export async function inviteOrAssignAdmin(
    _previousState: StaffActionState,
    formData: FormData,
): Promise<StaffActionState> {
    const parsed = inviteSchema.safeParse({ email: formData.get("email") });
    if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
    }

    let admin: Awaited<ReturnType<typeof requireAdmin>>;
    try {
        admin = await requireAdmin();
    } catch {
        return { status: "error", message: "You must be an administrator to manage staff access." };
    }

    let origin: string;
    try {
        origin = getTrustedAppOrigin();
    } catch {
        return { status: "error", message: "Staff invitations are not configured for this environment." };
    }

    const existing = await findAuthUserByEmail(parsed.data.email);
    if (existing === "unavailable") {
        return { status: "error", message: "Staff access could not be checked. Try again later." };
    }

    let userId: string;
    let invitationSent = false;
    let pendingInvitation = false;

    if (existing) {
        if (!existing.email_confirmed_at && !existing.invited_at) {
            return {
                status: "error",
                message: "This account has not completed email verification. Ask the account holder to finish their existing verification first.",
            };
        }
        userId = existing.id;
        pendingInvitation = Boolean(existing.invited_at && !existing.email_confirmed_at);
    } else {
        const callback = new URL("/auth/callback?flow=invite", origin).toString();
        let data: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.inviteUserByEmail>>["data"];
        try {
            const result = await supabaseAdmin.auth.admin.inviteUserByEmail(parsed.data.email, {
                redirectTo: callback,
            });
            if (result.error) {
                return {
                    status: "error",
                    message: "The invitation could not be sent. The address may already belong to an account; check the existing account before retrying.",
                };
            }
            data = result.data;
        } catch {
            return {
                status: "error",
                message: "The invitation could not be sent. The address may already belong to an account; check the existing account before retrying.",
            };
        }
        if (!data.user) {
            return {
                status: "error",
                message: "The invitation could not be sent. The address may already belong to an account; check the existing account before retrying.",
            };
        }
        userId = data.user.id;
        invitationSent = true;
    }

    const roleResult = await assignAdminRole(userId, admin.supabase);
    if (!roleResult) {
        return {
            status: "error",
            message: invitationSent
                ? "The invitation was sent, but administrator access could not be confirmed. Retry this email after the invitation is accepted or contact support."
                : "Administrator access could not be assigned. No changes were made; try again or contact support.",
        };
    }

    revalidatePath("/dashboard/staff");

    if (invitationSent) {
        return {
            status: "success",
            message: "Invitation sent. The recipient can set their own password and access the dashboard after accepting it.",
        };
    }

    if (roleResult === "already") {
        return {
            status: "success",
            message: pendingInvitation
                ? "Administrator access is already assigned. The recipient can access the dashboard after accepting their existing invitation."
                : "This account already has administrator access.",
        };
    }

    return {
        status: "success",
        message: pendingInvitation
            ? "Administrator access is assigned. The recipient can access the dashboard after accepting their existing invitation."
            : "Administrator access is assigned to the existing account.",
    };
}
