"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/integrations/supabase/browser";
import { cn } from "@/lib/utils";
import { readAuthFragment } from "@/lib/auth/auth-fragment";

export default function AuthFragmentCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        const fragment = readAuthFragment(window.location.hash);

        // Clear URL fragments before exchanging them; tokens are never logged or retained in browser history.
        window.history.replaceState(null, document.title, window.location.pathname);

        if (!fragment) {
            queueMicrotask(() => {
                if (active) setError(true);
            });
            return () => {
                active = false;
            };
        }

        void (async () => {
            try {
                const supabase = createSupabaseBrowserClient();
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: fragment.accessToken,
                    refresh_token: fragment.refreshToken,
                });

                if (!active) return;
                if (sessionError) {
                    setError(true);
                    return;
                }

                const destination = fragment.type === "invite"
                    ? "/dashboard/accept-invitation"
                    : "/dashboard/reset-password";
                router.replace(destination);
                router.refresh();
            } catch {
                if (active) setError(true);
            }
        })();

        return () => {
            active = false;
        };
    }, [router]);

    return (
        <main className="grid min-h-[100dvh] place-items-center bg-background px-5 py-12 text-foreground">
            <section className="w-full max-w-md border border-gold/30 bg-card p-7 shadow-xl shadow-jungle/10 sm:p-10" aria-live="polite">
                {error ? (
                    <>
                        <p className="eyebrow text-gold-readable">Secure account access</p>
                        <h1 className="mt-3 font-serif text-3xl text-primary">This link is unavailable.</h1>
                        <p className="mt-4 text-sm leading-6 text-muted-foreground" role="alert">
                            The sign-in link is invalid, expired, or already used. Request a fresh recovery email or ask an administrator for a new invitation.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            <Link href="/dashboard/forgot-password" className={cn(buttonVariants({ variant: "gold", size: "xl" }), "w-full")}>
                                Request recovery email
                            </Link>
                            <Link href="/dashboard/login" className="text-center text-sm text-primary underline-offset-4 hover:text-gold-readable hover:underline">
                                Return to sign in
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <LoaderCircle className="size-5 animate-spin text-gold-readable" aria-hidden="true" />
                        Verifying your secure sign-in link…
                    </div>
                )}
            </section>
        </main>
    );
}
