import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, FileText, Map, Sparkles } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Website Content | AIMILLE VOYAGES", robots: { index: false, follow: false } };

const sections = [
    { title: "Destinations", description: "Destination pages and their connected website details.", href: "/dashboard/content/destinations", icon: Map, source: "Sanity" },
    { title: "Experiences", description: "Experience pages, destination links and category assignments.", href: "/dashboard/content/experiences", icon: Sparkles, source: "Sanity" },
    { title: "Experience categories", description: "The category documents used to organise experiences.", href: "/dashboard/content/experience-categories", icon: Compass, source: "Sanity" },
    { title: "Travel packages", description: "Curated trips with references to destinations and experiences.", href: "/dashboard/content/packages", icon: Map, source: "Sanity" },
    { title: "Articles", description: "Editorial articles with excerpts, publication dates and SEO fields.", href: "/dashboard/content/articles", icon: FileText, source: "Sanity" },
    { title: "Travel guides", description: "Practical guides connected to existing destinations and experiences.", href: "/dashboard/content/guides", icon: Compass, source: "Sanity" },
    { title: "Services", description: "Review the service information currently used by the public website.", href: "/dashboard/content/services", icon: FileText, source: "Code managed" },
];

export default function ContentHomePage() {
    return (
        <div className="space-y-7">
            <DashboardPageHeader title="Website content" description="Manage existing editorial content from one place. Sanity remains the source of truth for destination and experience pages." eyebrow="Editorial" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sections.map(({ title, description, href, icon: Icon, source }) => (
                    <Link href={href} key={href} className="group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                        <Card className="h-full border-border bg-card transition-colors group-hover:border-gold/60">
                            <CardHeader className="flex-row items-start justify-between gap-4">
                                <div className="flex size-11 items-center justify-center border border-gold/30 bg-gold/10 text-jungle"><Icon aria-hidden="true" className="size-5" /></div>
                                <span className="text-xs text-muted-foreground">{source}</span>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="font-serif text-xl text-primary">{title}</CardTitle>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                                <span className="mt-5 inline-flex items-center gap-2 text-sm text-jungle">Open section <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            <div className="border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed text-foreground">
                Service information is currently code-managed in <code className="font-mono">src/content/services.ts</code>. The service catalog stays read-only until the source-of-truth migration is reviewed. Package, article and guide schemas are now available in the Sanity Studio, but no production documents have been created.
            </div>
        </div>
    );
}
