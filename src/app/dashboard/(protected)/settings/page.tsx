import Link from "next/link";
import { ArrowUpRight, Bell, Compass, Database, FileText } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export const metadata = { title: "Settings | AIMILLE VOYAGES Dashboard", robots: { index: false, follow: false } };

const sources = [
    { label: "Enquiries, bookings and customer records", source: "Supabase", icon: Database },
    { label: "Destinations and experiences", source: "Sanity CMS", icon: Compass },
    { label: "Service descriptions", source: "Existing website content", icon: FileText },
    { label: "Delivery history", source: "Supabase notification logs", icon: Bell },
];

export default function DashboardSettingsPage() {
    return (
        <div>
            <DashboardPageHeader title="Workspace settings" description="A reference for the systems that currently hold AIMILLE VOYAGES business and website data." />
            <section className="border border-border bg-card">
                <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="text-xl text-primary">Connected data sources</h2><p className="mt-1 text-sm text-muted-foreground">The dashboard reads and manages data in its existing system of record.</p></div>
                <ul className="divide-y divide-border">
                    {sources.map(({ label, source, icon: Icon }) => <li key={label} className="flex items-center gap-4 px-5 py-4 sm:px-6"><span className="grid size-10 shrink-0 place-items-center border border-gold/30 bg-ivory text-jungle dark:bg-jungle dark:text-gold-readable"><Icon className="size-4" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-foreground">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{source}</span></span></li>)}
                </ul>
            </section>
            <section className="mt-6 border border-border bg-card p-5 sm:p-6">
                <h2 className="text-xl text-primary">Available workspace areas</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Operational and editorial records are managed in their respective modules. The current database does not define general business settings or staff display preferences, so this page does not present unsaved controls as if they were persisted.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/dashboard/content/destinations" className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm hover:border-gold">Manage website content <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                    <Link href="/dashboard/notifications" className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm hover:border-gold">View notification log <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                </div>
            </section>
        </div>
    );
}
