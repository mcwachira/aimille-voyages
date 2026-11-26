import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Page not found | AIMILLE VOYAGES",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <section className="container-x flex min-h-[65vh] flex-col items-start justify-center py-20">
            <p className="eyebrow text-gold-readable">AIMILLE VOYAGES</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl text-primary md:text-7xl">This page is no longer here.</h1>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">The content may have been removed or the address may have changed.</p>
            <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className={buttonVariants({ variant: "brand" })}>Return home</Link>
                <Link href="/destinations" className={buttonVariants({ variant: "outline" })}>Explore destinations</Link>
            </div>
        </section>
    );
}
