import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataState } from "@/components/dashboard/operations/RecordPanels";
import { RecordFilters } from "@/components/dashboard/operations/RecordFilters";
import { RecordPagination } from "@/components/dashboard/operations/RecordPagination";
import { listEnquiries, listEnquiryStatuses, OPERATIONS_PAGE_SIZE } from "@/lib/dashboard/operations/queries";

export const metadata: Metadata = { title: "Enquiries | AIMILLE VOYAGES", robots: { index: false, follow: false } };

const filterSchema = z.object({ q: z.string().trim().max(100).optional(), status: z.string().trim().max(80).optional() });
const pageSchema = z.coerce.number().int().min(1).max(10_000);

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
    const params = await searchParams;
    const parsed = filterSchema.safeParse(params);
    const filters = parsed.success ? parsed.data : {};
    const pageResult = pageSchema.safeParse(params.page);
    const page = pageResult.success ? pageResult.data : 1;
    const [result, statusResult] = await Promise.all([
        listEnquiries({ query: filters.q, status: filters.status, page }),
        listEnquiryStatuses(),
    ]);
    const records = result.data?.items;
    const statuses = statusResult.data ?? [];

    return (
        <section className="space-y-7">
            <DashboardPageHeader eyebrow="Client pipeline" title="Enquiries" description="Review incoming travel requests and the details guests have shared." />
            <RecordFilters action="/dashboard/enquiries" query={filters.q} status={filters.status} statuses={statuses} />
            {!result.data ? (
                <DataState kind="error" title="Enquiries are unavailable" detail="The records could not be loaded through your current staff session. Check access and try again." />
            ) : records?.length === 0 ? (
                <DataState kind="empty" title="No matching enquiries" detail="There are no enquiries matching these filters." />
            ) : (
                <div className="space-y-4">
                <section className="overflow-hidden border border-border bg-card">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
                        <h2 className="font-serif text-xl text-primary">Enquiry requests</h2>
                        <p className="text-xs text-muted-foreground">Showing {result.data.total ? (result.data.page - 1) * OPERATIONS_PAGE_SIZE + 1 : 0}–{Math.min(result.data.page * OPERATIONS_PAGE_SIZE, result.data.total)} of {result.data.total}</p>
                    </div>
                    <div className="divide-y divide-border md:hidden">
                        {records?.map((enquiry) => (
                            <Link key={enquiry.id} href={`/dashboard/enquiries/${enquiry.id}`} className="block p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-foreground">{enquiry.client_name}</p>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">{enquiry.email}</p>
                                    </div>
                                    <StatusBadge status={enquiry.status} />
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">{enquiry.destination || enquiry.category}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{new Date(enquiry.created_at).toLocaleDateString()}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                                <tr><th className="px-5 py-3 font-medium">Client</th><th className="px-5 py-3 font-medium">Request</th><th className="px-5 py-3 font-medium">Travel dates</th><th className="px-5 py-3 font-medium">Received</th><th className="px-5 py-3 font-medium">Status</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {records?.map((enquiry) => (
                                    <tr key={enquiry.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-4"><Link className="font-medium text-primary hover:underline" href={`/dashboard/enquiries/${enquiry.id}`}>{enquiry.client_name}</Link><span className="mt-1 block text-xs text-muted-foreground">{enquiry.email}</span></td>
                                        <td className="px-5 py-4">{enquiry.destination || enquiry.category}<span className="mt-1 block text-xs text-muted-foreground">{enquiry.category}</span></td>
                                        <td className="px-5 py-4 text-muted-foreground">{enquiry.arrival_date || "—"}{enquiry.departure_date ? ` – ${enquiry.departure_date}` : ""}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(enquiry.created_at).toLocaleDateString()}</td>
                                        <td className="px-5 py-4"><StatusBadge status={enquiry.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <RecordPagination path="/dashboard/enquiries" page={result.data.page} totalPages={result.data.totalPages} query={filters.q} status={filters.status} />
                </div>
            )}
        </section>
    );
}
