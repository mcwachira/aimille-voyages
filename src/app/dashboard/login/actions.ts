"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

type LoginState = {
    error: string;
    fieldErrors: {
        email?: string;
        password?: string;
    };
};

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address.").max(254),
    password: z.string().min(1, "Enter your password."),
});

export async function loginAction(
    _previousState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;

        return {
            error: "Please check the highlighted fields.",
            fieldErrors: {
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            },
        };
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.signInWithPassword(parsed.data);

        if (error) {
            return {
                error: "Email or password is incorrect. Please try again.",
                fieldErrors: {},
            };
        }
    } catch {
        return {
            error: "Sign in is temporarily unavailable. Please try again.",
            fieldErrors: {},
        };
    }

    redirect("/dashboard");
}

export type LogoutState = { error: string };

export async function logoutAction(
    _previousState: LogoutState,
    _formData: FormData,
): Promise<LogoutState> {
    void _previousState;
    void _formData;

    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { error: "Unable to sign out. Please try again." };
        }
    } catch {
        return { error: "Unable to sign out. Please try again." };
    }

    redirect("/dashboard/login");
}
