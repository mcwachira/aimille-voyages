"use server";

import { z } from "zod";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

export type ResetPasswordState = {
    status: "idle" | "success" | "error" | "expired";
    message: string;
    fieldErrors: { password?: string; confirmPassword?: string };
};

const resetPasswordSchema = z
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

export async function resetPasswordAction(
    _previousState: ResetPasswordState,
    formData: FormData,
): Promise<ResetPasswordState> {
    const parsed = resetPasswordSchema.safeParse({
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        return {
            status: "error",
            message: "Please check your new password.",
            fieldErrors: {
                password: errors.password?.[0],
                confirmPassword: errors.confirmPassword?.[0],
            },
        };
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
            return {
                status: "expired",
                message: "This recovery session has expired. Request a new recovery email to continue.",
                fieldErrors: {},
            };
        }

        const { error } = await supabase.auth.updateUser({
            password: parsed.data.password,
        });

        if (error) {
            return {
                status: "error",
                message: "We couldn't update your password. The recovery link may have expired; request a new one and try again.",
                fieldErrors: {},
            };
        }
    } catch {
        return {
            status: "error",
            message: "We couldn't update your password. The recovery link may have expired; request a new one and try again.",
            fieldErrors: {},
        };
    }

    return {
        status: "success",
        message: "Your password has been updated. Sign in with your new password.",
        fieldErrors: {},
    };
}
