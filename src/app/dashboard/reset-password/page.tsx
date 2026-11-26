import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/site/Logo";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { cn } from "@/lib/utils";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
    title: "Reset Password | AIMILLE VOYAGES",
    robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
    let hasValidSession = false;

    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.getUser();
        hasValidSession = !error && Boolean(data.user);
    } catch {
        // Recovery access fails closed if the session cannot be verified.
    }

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
                            Secure your account.
                        </h1>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
                            Choose a new password to continue to your workspace.
                        </p>
                    </div>
                    <p className="eyebrow mt-10 text-ivory/50">AIMILLE VOYAGES · KENYA</p>
                </aside>
                <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14">
                    <div className="w-full max-w-md">
                        <p className="eyebrow text-gold-readable">Password recovery</p>
                        <h2 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
                            Set a new password.
                        </h2>
                        {hasValidSession ? (
                            <>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    Use at least 8 characters for your new password.
                                </p>
                                <ResetPasswordForm />
                            </>
                        ) : (
                            <div className="mt-5 space-y-6">
                                <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                                    This recovery session is missing or has expired. Request a new recovery email to continue.
                                </p>
                                <Link
                                    href="/dashboard/forgot-password"
                                    className={cn(buttonVariants({ variant: "gold", size: "xl" }), "w-full")}
                                >
                                    Request another recovery email
                                </Link>
                                <p className="text-center">
                                    <Link
                                        href="/dashboard/login"
                                        className="text-sm text-primary underline-offset-4 hover:text-gold-readable hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                    >
                                        Return to sign in
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
