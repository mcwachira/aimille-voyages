import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, Users } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { formatDashboardDate, getDashboardOverview } from "@/lib/dashboard/overview";

export const metadata = {
    title: "Overview | AIMILLE VOYAGES Dashboard",
    robots: { index: false, follow: false },
};

function Metric({ label, value, detail, icon: Icon }: { label: string; value: number | null; detail: string; icon: typeof Users }) {
    return (
        <article className="border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{label}</p>
                <span className="grid size-9 place-items-center border border-gold/30 bg-ivory text-jungle dark:bg-jungle dark:text-gold-readable"><Icon className="size-4" aria-hidden="true" /></span>
            </div>
            <p className="mt-5 font-serif text-3xl text-primary">{value === null ? "—" : value.toLocaleString("en-GB")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{value === null ? "Data unavailable for this account" : detail}</p>
        </article>
    );
}

export default async function DashboardOverviewPage() {
    const data = await getDashboardOverview();

    return (
        <div>
            <DashboardPageHeader
                eyebrow="AIMILLE VOYAGES · Workspace"
                title="Good to see you."
                description="A live overview of operational records visible to your staff account."
                action={<Link href="/dashboard/enquiries" className={buttonVariants({ variant: "gold", size: "lg" })}>Review enquiries <ArrowRight className="size-4" /></Link>}
            />

            <section aria-label="Operational overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="All enquiries" value={data.metrics.enquiries} detail="Visible enquiry records" icon={ClipboardList} />
                <Metric label="New this week" value={data.metrics.newEnquiries} detail="Created in the past seven days" icon={CalendarDays} />
                <Metric label="Non-archived bookings" value={data.metrics.bookings} detail="Visible booking records not archived" icon={CalendarDays} />
                <Metric label="Customers" value={data.metrics.customers} detail="Visible customer records" icon={Users} />
            </section>

            <section className="mt-5 border border-border bg-card px-5 py-4 sm:px-6" aria-label="Upcoming travel summary">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg text-primary">Future arrival dates</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Non-archived booking records dated today or later, regardless of status.</p>
                    </div>
                    <span className="font-serif text-2xl text-primary">{data.metrics.upcomingBookings === null ? "—" : data.metrics.upcomingBookings.toLocaleString("en-GB")}</span>
                </div>
                {data.errors.bookings ? <p className="mt-3 text-xs text-muted-foreground">Booking totals are unavailable for this staff account.</p> : null}
            </section>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <section className="min-w-0 border border-border bg-card">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                        <div><h2 className="text-xl text-primary">Recent enquiries</h2><p className="mt-1 text-xs text-muted-foreground">Latest records visible to your account</p></div>
                        <Link href="/dashboard/enquiries" className="text-xs text-jungle underline underline-offset-4 hover:text-gold-readable dark:text-gold-readable">View all</Link>
                    </div>
                    {data.recentEnquiries.length ? (
                        <div className="divide-y divide-border">
                            {data.recentEnquiries.map((enquiry) => (
                                <Link key={enquiry.id} href={`/dashboard/enquiries/${enquiry.id}`} className="flex min-w-0 items-center justify-between gap-4 px-5 py-4 hover:bg-muted/50 sm:px-6">
                                    <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{enquiry.client_name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{enquiry.destination || enquiry.category} · {formatDashboardDate(enquiry.created_at)}</p></div>
                                    <StatusBadge status={enquiry.status} />
                                </Link>
                            ))}
                        </div>
                    ) : <div className="p-5"><DashboardEmptyState title={data.errors.enquiries ? "Enquiries unavailable" : "No enquiries yet"} description={data.errors.enquiries ? "This staff account cannot currently read enquiry records." : "Enquiries will appear here when records are available."} /></div>}
                </section>

                <section className="min-w-0 border border-border bg-card">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                        <div><h2 className="text-xl text-primary">Recent bookings</h2><p className="mt-1 text-xs text-muted-foreground">Latest non-archived records</p></div>
                        <Link href="/dashboard/bookings" className="text-xs text-jungle underline underline-offset-4 hover:text-gold-readable dark:text-gold-readable">View all</Link>
                    </div>
                    {data.recentBookings.length ? (
                        <div className="divide-y divide-border">
                            {data.recentBookings.map((booking) => (
                                <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`} className="flex min-w-0 items-center justify-between gap-4 px-5 py-4 hover:bg-muted/50 sm:px-6">
                                    <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{booking.booking_reference}</p><p className="mt-1 truncate text-xs text-muted-foreground">{booking.destination || "Destination not set"} · {formatDashboardDate(booking.arrival_date)}</p></div>
                                    <StatusBadge status={booking.status} />
                                </Link>
                            ))}
                        </div>
                    ) : <div className="p-5"><DashboardEmptyState title={data.errors.bookings ? "Bookings unavailable" : "No bookings yet"} description={data.errors.bookings ? "This staff account cannot currently read booking records." : "Bookings will appear here when records are available."} /></div>}
                </section>
            </div>

            <section className="mt-8 border border-border bg-card">
                <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="text-xl text-primary">Recent activity</h2><p className="mt-1 text-xs text-muted-foreground">Administrative log entries</p></div>
                {data.activity.length ? (
                    <ul className="divide-y divide-border">
                        {data.activity.map((entry) => (
                            <li key={entry.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
                                <div className="min-w-0"><p className="truncate text-sm text-foreground">{entry.summary || `${entry.action.replaceAll("_", " ")} · ${entry.entity_type.replaceAll("_", " ")}`}</p><p className="mt-1 text-xs text-muted-foreground">{entry.user_id ? "Staff member" : "System"}</p></div>
                                <time className="shrink-0 text-xs text-muted-foreground">{formatDashboardDate(entry.created_at)}</time>
                            </li>
                        ))}
                    </ul>
                ) : <div className="p-5"><DashboardEmptyState title={data.errors.activity ? "Activity unavailable" : "No activity recorded"} description={data.errors.activity ? "Activity records are unavailable for this staff account." : "When activity is recorded, the latest entries will appear here."} /></div>}
            </section>
        </div>
    );
}
