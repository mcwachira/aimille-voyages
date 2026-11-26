import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DataState } from "@/components/dashboard/operations/RecordPanels";
import { RecordFilters } from "@/components/dashboard/operations/RecordFilters";
import { RecordPagination } from "@/components/dashboard/operations/RecordPagination";
import { listCustomers, OPERATIONS_PAGE_SIZE } from "@/lib/dashboard/operations/queries";

export const metadata: Metadata = { title: "Customers | AIMILLE VOYAGES", robots: { index: false, follow: false } };

const filterSchema = z.object({ q: z.string().trim().max(100).optional() });
const pageSchema = z.coerce.number().int().min(1).max(10_000);

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
    const params = await searchParams;
    const parsed = filterSchema.safeParse(params);
    const query = parsed.success ? parsed.data.q : undefined;
    const pageResult = pageSchema.safeParse(params.page);
    const page = pageResult.success ? pageResult.data : 1;
    const result = await listCustomers({ query, page });
    const records = result.data?.items;

    return (
        <section className="space-y-7">
            <DashboardPageHeader eyebrow="Guest relationships" title="Customers" description="A directory of travellers with enquiries or bookings in the system." />
            <RecordFilters action="/dashboard/customers" query={query} />
            {!result.data ? (
                <DataState kind="error" title="Customers are unavailable" detail="The directory could not be loaded through your current staff session. Check access and try again." />
            ) : records?.length === 0 ? (
                <DataState kind="empty" title="No matching customers" detail="There are no customer records matching this search." />
            ) : (
                <div className="space-y-4">
                <section className="overflow-hidden border border-border bg-card">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5"><h2 className="font-serif text-xl text-primary">Customer directory</h2><p className="text-xs text-muted-foreground">Showing {result.data.total ? (result.data.page - 1) * OPERATIONS_PAGE_SIZE + 1 : 0}–{Math.min(result.data.page * OPERATIONS_PAGE_SIZE, result.data.total)} of {result.data.total}</p></div>
                    <div className="divide-y divide-border md:hidden">
                        {records?.map((customer) => (
                            <Link key={customer.id} href={`/dashboard/customers/${customer.id}`} className="block p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <p className="font-medium text-foreground">{customer.full_name}</p><p className="mt-1 break-all text-xs text-muted-foreground">{customer.email}</p><p className="mt-2 text-xs text-muted-foreground">{[customer.country, customer.phone].filter(Boolean).join(" · ") || "Contact details not provided"}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Customer</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Phone</th><th className="px-5 py-3 font-medium">Country</th><th className="px-5 py-3 font-medium">Updated</th></tr></thead>
                            <tbody className="divide-y divide-border">
                                {records?.map((customer) => (
                                    <tr key={customer.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-4"><Link className="font-medium text-primary hover:underline" href={`/dashboard/customers/${customer.id}`}>{customer.full_name}</Link>{customer.company && <span className="mt-1 block text-xs text-muted-foreground">{customer.company}</span>}</td>
                                        <td className="px-5 py-4"><a className="text-foreground hover:underline" href={`mailto:${customer.email}`}>{customer.email}</a></td>
                                        <td className="px-5 py-4 text-muted-foreground">{customer.phone || "—"}</td>
                                        <td className="px-5 py-4 text-muted-foreground">{customer.country || "—"}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(customer.updated_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <RecordPagination path="/dashboard/customers" page={result.data.page} totalPages={result.data.totalPages} query={query} />
                </div>
            )}
        </section>
    );
}
