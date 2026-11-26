"use client";

import { Button } from "@/components/ui/button";

export default function DashboardRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <section className="mx-auto max-w-2xl border border-border bg-card p-7 sm:p-10" role="alert">
            <span className="gold-rule" aria-hidden="true" />
            <p className="eyebrow mt-6 text-gold-readable">Workspace</p>
            <h1 className="mt-3 text-3xl text-primary">This section could not load.</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Please try again. If the issue continues, contact the site administrator.</p>
            <Button type="button" variant="brand" size="lg" className="mt-6" onClick={reset}>Try again</Button>
        </section>
    );
}
