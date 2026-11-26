import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/site/Logo";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { cn } from "@/lib/utils";
import { ResetPasswordForm } from "../reset-password/ResetPasswordForm";
import { acceptInvitationAction } from "./actions";

export const metadata: Metadata = {
    title: "Accept Staff Invitation | AIMILLE VOYAGES",
    robots: { index: false, follow: false },
};

export default async function AcceptInvitationPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string | string[] }>;
}) {
    const params = await searchParams;
    let hasValidSession = false;

    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.getUser();
        hasValidSession = !error && Boolean(data.user?.invited_at);
    } catch {
        // Invitation acceptance fails closed if the session cannot be verified.
    }

    const invitationError = params.error === "invite" || !hasValidSession;

    return (
        <section className="container-x flex min-h-[100svh] items-center justify-center py-10 sm:py-14">
            <div className="grid w-full max-w-5xl overflow-hidden border border-gold/30 bg-background shadow-2xl shadow-jungle/10 lg:grid-cols-2">
                <aside className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-jungle p-8 text-ivory sm:min-h-80 sm:p-12 lg:min-h-[560px]">
                    <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full border border-gold/20" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-8 -top-12 size-56 rounded-full border border-gold/15" aria-hidden="true" />
                    <Logo light />
                    <div className="relative mt-12 max-w-md lg:mt-0">
                        <span className="gold-rule" aria-hidden="true" />
                        <p className="eyebrow mt-6 text-gold-readable">Team workspace</p>
                        <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory sm:text-5xl">
                            Welcome to the team.
                        </h1>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
                            Verify your invitation and set a password for your account.
                        </p>
                    </div>
                    <p className="eyebrow mt-10 text-ivory/50">AIMILLE VOYAGES · KENYA</p>
                </aside>
                <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14">
                    <div className="w-full max-w-md">
                        <p className="eyebrow text-gold-readable">Staff invitation</p>
                        <h2 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
                            {invitationError ? "Invitation unavailable." : "Set your password."}
                        </h2>
                        {invitationError ? (
                            <div className="mt-5 space-y-6">
                                <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                                    This invitation is invalid, expired, or already used. Ask an administrator for a new invitation.
                                </p>
                                <Link
                                    href="/dashboard/login"
                                    className={cn(buttonVariants({ variant: "gold", size: "xl" }), "w-full")}
                                >
                                    Return to sign in
                                </Link>
                            </div>
                        ) : (
                            <>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    Choose a password to finish setting up your staff account.
                                </p>
                                <ResetPasswordForm action={acceptInvitationAction} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
