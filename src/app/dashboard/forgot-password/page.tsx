import type { Metadata } from "next";

import { Logo } from "@/components/site/Logo";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
    title: "Forgot Password | AIMILLE VOYAGES",
    robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string | string[] }>;
}) {
    const params = await searchParams;
    const callbackError = params.error === "recovery";

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
                            Return to your work, securely.
                        </h1>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
                            Request a secure link to choose a new password.
                        </p>
                    </div>
                    <p className="eyebrow mt-10 text-ivory/50">AIMILLE VOYAGES · KENYA</p>
                </aside>
                <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14">
                    <div className="w-full max-w-md">
                        <p className="eyebrow text-gold-readable">Account recovery</p>
                        <h2 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
                            Forgot your password?
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Enter your staff account email and we’ll send recovery instructions if an account matches.
                        </p>
                        <ForgotPasswordForm callbackError={callbackError} />
                    </div>
                </div>
            </div>
        </section>
    );
}
