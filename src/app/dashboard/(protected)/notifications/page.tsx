import Link from "next/link";

import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { formatDashboardDate } from "@/lib/dashboard/overview";

export const metadata = { title: "Notifications | AIMILLE VOYAGES Dashboard", robots: { index: false, follow: false } };

export default async function DashboardNotificationsPage() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("notification_logs")
        .select("id,channel,recipient,status,error_message,created_at,enquiry_id,booking_id")
        .order("created_at", { ascending: false })
        .limit(100);

    return (
        <div>
            <DashboardPageHeader title="Notification log" description="Delivery outcomes recorded by existing notification workflows. This log does not send or retry messages." />
            {error ? <DashboardEmptyState title="Notifications could not be loaded" description="The current staff account cannot read notification logs, or the service is temporarily unavailable." /> : data?.length ? (
                <div className="overflow-x-auto border border-border bg-card">
                    <table className="w-full min-w-[42rem] text-left text-sm">
                        <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr><th scope="col" className="px-5 py-3 font-medium">Channel</th><th scope="col" className="px-5 py-3 font-medium">Recipient</th><th scope="col" className="px-5 py-3 font-medium">Status</th><th scope="col" className="px-5 py-3 font-medium">Related record</th><th scope="col" className="px-5 py-3 font-medium">Created</th></tr></thead>
                        <tbody className="divide-y divide-border">
                            {data.map((entry) => (
                                <tr key={entry.id} className="align-top">
                                    <td className="px-5 py-4 capitalize">{entry.channel.replaceAll("_", " ")}</td>
                                    <td className="max-w-56 break-all px-5 py-4 text-muted-foreground">{entry.recipient}</td>
                                    <td className="px-5 py-4"><StatusBadge status={entry.status} />{entry.error_message ? <p className="mt-2 max-w-64 text-xs text-destructive">{entry.error_message}</p> : null}</td>
                                    <td className="px-5 py-4 text-xs text-muted-foreground"><div className="flex flex-col items-start gap-1">{entry.enquiry_id && <Link className="text-primary underline-offset-4 hover:underline" href={`/dashboard/enquiries/${entry.enquiry_id}`}>Enquiry {entry.enquiry_id.slice(0, 8)}</Link>}{entry.booking_id && <Link className="text-primary underline-offset-4 hover:underline" href={`/dashboard/bookings/${entry.booking_id}`}>Booking {entry.booking_id.slice(0, 8)}</Link>}{!entry.enquiry_id && !entry.booking_id && "—"}</div></td>
                                    <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">{formatDashboardDate(entry.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">Showing up to 100 latest log entries. Read/unread state and notification preferences are not represented in the current data model.</p>
                </div>
            ) : <DashboardEmptyState title="No notifications recorded" description="Delivery logs will appear here when an existing notification workflow records an outcome." />}
        </div>
    );
}
