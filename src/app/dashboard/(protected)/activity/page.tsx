import Link from "next/link";
import { Search } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { formatDashboardDate } from "@/lib/dashboard/overview";
import { getDashboardRecordLink } from "@/lib/dashboard/record-links";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Activity | AIMILLE VOYAGES Dashboard", robots: { index: false, follow: false } };

function ActivityRecordLink({ entityType, entityId }: { entityType: string; entityId: string | null }) {
    const record = getDashboardRecordLink(entityType, entityId);
    return record ? <Link href={record.href} className="mt-2 inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline">Open {record.label}</Link> : null;
}

export default async function DashboardActivityPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
    const params = await searchParams;
    const query = params.q?.trim().slice(0, 100) ?? "";
    const entityType = params.type?.trim().slice(0, 80) ?? "";
    const supabase = await createSupabaseServerClient();
    let request = supabase.from("activity_logs").select("id,action,entity_type,entity_id,summary,details,created_at,user_id").order("created_at", { ascending: false }).limit(100);
    if (entityType) request = request.eq("entity_type", entityType);
    if (query) request = request.ilike("summary", `%${query.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`);
    const { data, error } = await request;

    return (
        <div>
            <DashboardPageHeader title="Activity log" description="Review operational and administrative events recorded by the application." />
            <form method="get" className="mb-6 flex flex-col gap-3 border border-border bg-card p-4 sm:flex-row sm:items-end">
                <label className="flex-1 text-xs font-medium text-muted-foreground">Search summary
                    <span className="mt-2 flex h-10 items-center gap-2 border border-input bg-background px-3"><Search className="size-4 shrink-0" aria-hidden="true" /><input name="q" defaultValue={query} maxLength={100} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none" placeholder="Search activity" /></span>
                </label>
                <label className="text-xs font-medium text-muted-foreground">Entity type
                    <input name="type" defaultValue={entityType} maxLength={80} className="mt-2 block h-10 w-full border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-48" placeholder="e.g. enquiry" />
                </label>
                <Button type="submit" variant="brand" size="lg">Apply filters</Button>
                {query || entityType ? <Link href="/dashboard/activity" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Clear</Link> : null}
            </form>
            {error ? <DashboardEmptyState title="Activity could not be loaded" description="The current staff account cannot read activity records, or the service is temporarily unavailable." /> : data?.length ? (
                <div className="overflow-hidden border border-border bg-card">
                    <ul className="divide-y divide-border">
                        {data.map((entry) => (
                            <li key={entry.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
                                <div className="min-w-0">
                                    <p className="break-words text-sm font-medium text-foreground">{entry.summary || `${entry.action.replaceAll("_", " ")} · ${entry.entity_type.replaceAll("_", " ")}`}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{entry.entity_type.replaceAll("_", " ")}{entry.entity_id ? ` · ${entry.entity_id}` : ""} · {entry.user_id ? "Staff member" : "System"}</p>
                                    <ActivityRecordLink entityType={entry.entity_type} entityId={entry.entity_id} />
                                </div>
                                <time className="text-xs text-muted-foreground">{formatDashboardDate(entry.created_at)}</time>
                            </li>
                        ))}
                    </ul>
                    <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">Showing up to 100 matching entries.</p>
                </div>
            ) : <DashboardEmptyState title="No activity found" description="No recorded activity matches these filters." />}
        </div>
    );
}
