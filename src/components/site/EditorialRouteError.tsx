"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function EditorialRouteError({ reset }: { reset: () => void }) {
    return (
        <section className="container-x flex min-h-[55vh] flex-col items-start justify-center py-20" role="alert">
            <p className="eyebrow text-gold-readable">AIMILLE VOYAGES</p>
            <h1 className="mt-4 font-serif text-4xl text-primary">This content could not be loaded.</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">Please try again in a moment, or return to the public website.</p>
            <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={reset} className={buttonVariants({ variant: "brand" })}>Try again</button>
                <Link href="/" className={buttonVariants({ variant: "outline" })}>Return home</Link>
            </div>
        </section>
    );
}
