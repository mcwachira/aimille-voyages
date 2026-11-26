import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { getTrustedAppOrigin } from "@/lib/auth/trusted-origin";

export async function GET(request: NextRequest) {
    let origin: string;

    try {
        origin = getTrustedAppOrigin();
    } catch {
        return new Response("Authentication is temporarily unavailable.", {
            status: 503,
        });
    }
    const code = request.nextUrl.searchParams.get("code");
    const tokenHash = request.nextUrl.searchParams.get("token_hash");
    const otpType = request.nextUrl.searchParams.get("type");
    const supportedOtpType: EmailOtpType | null =
        otpType === "invite" || otpType === "recovery" ? otpType : null;
    const isInvitation = supportedOtpType
        ? supportedOtpType === "invite"
        : request.nextUrl.searchParams.get("flow") === "invite";
    const successPath = isInvitation
        ? "/dashboard/accept-invitation"
        : "/dashboard/reset-password";
    const errorPath = isInvitation
        ? "/dashboard/accept-invitation?error=invite"
        : "/dashboard/forgot-password?error=recovery";

    if (!code && !tokenHash && !otpType) {
        const fragmentPath = request.nextUrl.searchParams.get("flow") === "invite"
            ? "/auth/callback/fragment?flow=invite"
            : "/auth/callback/fragment";
        return NextResponse.redirect(new URL(fragmentPath, origin));
    }

    if (!code && !(tokenHash && supportedOtpType)) {
        return NextResponse.redirect(new URL(errorPath, origin));
    }

    try {
        const supabase = await createSupabaseServerClient();
        const result = tokenHash && supportedOtpType
            ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: supportedOtpType })
            : await supabase.auth.exchangeCodeForSession(code!);

        if (!result.error) {
            return NextResponse.redirect(new URL(successPath, origin));
        }
    } catch {
        // Keep callback failures generic; never log or expose the auth code.
    }

    return NextResponse.redirect(new URL(errorPath, origin));
}
