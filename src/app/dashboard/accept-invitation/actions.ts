"use server";

import { z } from "zod";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import type { ResetPasswordState } from "../reset-password/actions";

const invitationPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Use at least 8 characters.")
            .max(128, "Password must be 128 characters or fewer."),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export async function acceptInvitationAction(
    _previousState: ResetPasswordState,
    formData: FormData,
): Promise<ResetPasswordState> {
    const parsed = invitationPasswordSchema.safeParse({
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        return {
            status: "error",
            message: "Please check your password.",
            fieldErrors: {
                password: errors.password?.[0],
                confirmPassword: errors.confirmPassword?.[0],
            },
        };
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError || !data.user?.invited_at) {
            return {
                status: "expired",
                message: "This invitation is invalid or has expired. Ask an administrator for a new invitation.",
                fieldErrors: {},
            };
        }

        const { error } = await supabase.auth.updateUser({
            password: parsed.data.password,
        });

        if (error) {
            return {
                status: "error",
                message: "We couldn't finish setting up your account. Ask an administrator for a new invitation.",
                fieldErrors: {},
            };
        }
    } catch {
        return {
            status: "error",
            message: "We couldn't finish setting up your account. Ask an administrator for a new invitation.",
            fieldErrors: {},
        };
    }

    return {
        status: "success",
        message: "Your password has been set. Sign in to continue.",
        fieldErrors: {},
    };
}
