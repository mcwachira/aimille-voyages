import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Dashboard Access | AIMILLE VOYAGES",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardUnauthorizedPage() {
    return (
        <section className="container-x flex min-h-[100svh] items-center justify-center py-12 sm:py-16">
            <div className="w-full max-w-2xl border border-gold/30 bg-background p-8 shadow-xl shadow-jungle/10 sm:p-12 lg:p-16">
                <span className="gold-rule" aria-hidden="true" />
                <p className="eyebrow mt-7 text-gold-readable">Dashboard access</p>
                <h1 className="mt-4 font-serif text-4xl leading-tight text-primary sm:text-5xl">
                    Access not available.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    This signed-in account does not have dashboard staff access. You can
                    return to the sign-in page or continue to the public website.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/dashboard/login"
                        className={buttonVariants({ variant: "gold", size: "xl" })}
                    >
                        Return to sign in
                    </Link>
                    <Link
                        href="/"
                        className={buttonVariants({
                            variant: "line",
                            size: "xl",
                            className: "text-primary",
                        })}
                    >
                        Visit the public website
                    </Link>
                </div>
            </div>
        </section>
    );
}
