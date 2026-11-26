"use server";

import { z } from "zod";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { getTrustedAppOrigin } from "@/lib/auth/trusted-origin";

export type ForgotPasswordState = {
    status: "idle" | "success" | "error";
    message: string;
    fieldErrors: { email?: string };
};

const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Enter a valid email address.").max(254),
});

function safeErrorMetadata(error: unknown) {
    if (!error || typeof error !== "object") {
        return { name: typeof error };
    }

    const candidate = error as { name?: unknown; status?: unknown; code?: unknown };
    return {
        name: typeof candidate.name === "string" ? candidate.name : "UnknownError",
        status: typeof candidate.status === "number" ? candidate.status : undefined,
        code:
            typeof candidate.code === "string" && /^[a-z0-9_.-]{1,80}$/i.test(candidate.code)
                ? candidate.code
                : undefined,
    };
}

export async function forgotPasswordAction(
    _previousState: ForgotPasswordState,
    formData: FormData,
): Promise<ForgotPasswordState> {
    const parsed = forgotPasswordSchema.safeParse({
        email: formData.get("email"),
    });

    if (!parsed.success) {
        return {
            status: "error",
            message: "Please enter a valid email address.",
            fieldErrors: {
                email: parsed.error.flatten().fieldErrors.email?.[0],
            },
        };
    }

    let phase = "server-client";

    try {
        const supabase = await createSupabaseServerClient();
        phase = "trusted-origin";
        const callbackUrl = new URL("/auth/callback", getTrustedAppOrigin()).toString();
        phase = "supabase-request";
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
            redirectTo: callbackUrl,
        });

        if (error) {
            console.error("[auth:forgot-password] Supabase rejected recovery request", {
                ...safeErrorMetadata(error),
                phase,
            });
            return {
                status: "error",
                message: "We couldn't process that request right now. Please try again.",
                fieldErrors: {},
            };
        }
    } catch (error) {
        console.error("[auth:forgot-password] Recovery request failed", {
            ...safeErrorMetadata(error),
            phase,
        });
        return {
            status: "error",
            message: "We couldn't process that request right now. Please try again.",
            fieldErrors: {},
        };
    }

    return {
        status: "success",
        message:
            "If an account matches that email address, recovery instructions will be sent.",
        fieldErrors: {},
    };
}
