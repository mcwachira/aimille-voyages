import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { InternalNoteForm } from "@/components/dashboard/operations/InternalNoteForm";
import { CreateBookingFromEnquiry } from "@/components/dashboard/operations/CreateBookingFromEnquiry";
import { RecordStatusForm } from "@/components/dashboard/operations/RecordStatusForm";
import { BackLink, DataState, DetailField, DetailGrid, NotesPanel } from "@/components/dashboard/operations/RecordPanels";
import { getEnquiry, listEnquiryBookings, listEnquiryNotes, listEnquiryStatuses } from "@/lib/dashboard/operations/queries";

export const metadata: Metadata = { title: "Enquiry details | AIMILLE VOYAGES", robots: { index: false, follow: false } };

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const parsed = z.string().uuid().safeParse((await params).id);
    if (!parsed.success) notFound();

    const enquiryResult = await getEnquiry(parsed.data);
    if (enquiryResult.error) {
        return <section className="space-y-7"><BackLink href="/dashboard/enquiries">All enquiries</BackLink><DataState kind="error" title="Enquiry is unavailable" detail="This record could not be loaded through your current staff session." /></section>;
    }
    if (!enquiryResult.data) notFound();
    const enquiry = enquiryResult.data;
    const [notesResult, statusesResult, bookingsResult] = await Promise.all([
        listEnquiryNotes(enquiry.id),
        listEnquiryStatuses(),
        listEnquiryBookings(enquiry.id),
    ]);

    return (
        <section className="space-y-7">
            <BackLink href="/dashboard/enquiries">All enquiries</BackLink>
            <DashboardPageHeader eyebrow="Enquiry record" title={enquiry.client_name} description={`${enquiry.category}${enquiry.destination ? ` · ${enquiry.destination}` : ""}`} action={<StatusBadge status={enquiry.status} />} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
                <div className="space-y-6">
                    <section className="overflow-hidden border border-border bg-card">
                        <h2 className="border-b border-border px-5 py-4 font-serif text-xl text-primary">Travel request</h2>
                        <DetailGrid>
                            <DetailField label="Email"><a className="text-primary underline-offset-4 hover:underline" href={`mailto:${enquiry.email}`}>{enquiry.email}</a></DetailField>
                            <DetailField label="Telephone">{enquiry.phone ? <a className="text-primary underline-offset-4 hover:underline" href={`tel:${enquiry.phone}`}>{enquiry.phone}</a> : null}</DetailField>
                            <DetailField label="Destination">{enquiry.destination}</DetailField>
                            <DetailField label="Category">{enquiry.category}</DetailField>
                            <DetailField label="Arrival">{enquiry.arrival_date}</DetailField>
                            <DetailField label="Departure">{enquiry.departure_date}</DetailField>
                            <DetailField label="Dates flexible">{enquiry.dates_flexible ? "Yes" : "No"}</DetailField>
                            <DetailField label="Travellers">{enquiry.adults === null && enquiry.children === null ? null : `${enquiry.adults ?? 0} adults${enquiry.children ? `, ${enquiry.children} children` : ""}`}</DetailField>
                            <DetailField label="Budget">{enquiry.budget ? `${enquiry.currency ? `${enquiry.currency} ` : ""}${enquiry.budget}` : null}</DetailField>
                            <DetailField label="Country">{enquiry.country}</DetailField>
                            <DetailField label="Company">{enquiry.company}</DetailField>
                            <DetailField label="Services">{enquiry.services.length ? enquiry.services.join(", ") : null}</DetailField>
                            <DetailField label="Preferences">{enquiry.preferences}</DetailField>
                            <DetailField label="Source page">{enquiry.source_page}</DetailField>
                        </DetailGrid>
                        {(enquiry.notes || enquiry.details) && (
                            <div className="space-y-5 border-t border-border p-5 sm:p-6">
                                {enquiry.notes && <div><h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Request notes</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{enquiry.notes}</p></div>}
                                {enquiry.details && Object.keys(enquiry.details).length > 0 && <div><h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Additional request details</h3><pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-5 text-foreground">{JSON.stringify(enquiry.details, null, 2)}</pre></div>}
                            </div>
                        )}
                    </section>
                    <NotesPanel notes={notesResult.data ?? []} error={Boolean(notesResult.error)} form={<InternalNoteForm kind="enquiry" id={enquiry.id} />} />
                </div>
                <aside className="space-y-6">
                    <section className="border border-border bg-card p-5 sm:p-6">
                        <RecordStatusForm kind="enquiry" id={enquiry.id} currentStatus={enquiry.status} availableStatuses={statusesResult.data ?? []} />
                    </section>
                    <section className="border border-border bg-card p-5 sm:p-6">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-readable">Booking history</p>
                        <h2 className="mt-2 font-serif text-xl text-primary">Related bookings</h2>
                        {bookingsResult.error ? <p className="mt-4 text-sm text-muted-foreground">Related booking history is unavailable.</p> : bookingsResult.data.length ? <ul className="mt-4 divide-y divide-border">{bookingsResult.data.map((booking) => <li key={booking.id} className="py-3 first:pt-0 last:pb-0"><Link className="font-medium text-primary hover:underline" href={`/dashboard/bookings/${booking.id}`}>{booking.booking_reference}</Link><p className="mt-1 text-xs text-muted-foreground">{booking.destination || "Destination not set"} · {booking.status}</p></li>)}</ul> : <><p className="mt-4 text-sm text-muted-foreground">No bookings are linked to this enquiry.</p><CreateBookingFromEnquiry enquiryId={enquiry.id} /></>}
                    </section>
                    <section className="border border-border bg-card p-5 sm:p-6">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-readable">Customer</p>
                        <h2 className="mt-2 font-serif text-xl text-primary">{enquiry.client_name}</h2>
                        {enquiry.customer_id ? <Link className="mt-4 inline-flex text-sm text-primary underline-offset-4 hover:underline" href={`/dashboard/customers/${enquiry.customer_id}`}>Open customer profile</Link> : <p className="mt-4 text-sm text-muted-foreground">This enquiry is not associated with a customer record.</p>}
                        <div className="mt-4 space-y-2 text-sm">{enquiry.company && <p className="text-muted-foreground">{enquiry.company}</p>}<p><a className="break-all text-primary hover:underline" href={`mailto:${enquiry.email}`}>{enquiry.email}</a></p>{enquiry.phone && <p><a className="text-primary hover:underline" href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></p>}</div>
                    </section>
                    <section className="border border-border bg-card p-5 sm:p-6"><p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Record history</p><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">Received</dt><dd className="mt-1">{new Date(enquiry.created_at).toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Last updated</dt><dd className="mt-1">{new Date(enquiry.updated_at).toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Follow-up owner</dt><dd className="mt-1">{enquiry.assigned_to || "Not assigned"}</dd></div></dl></section>
                </aside>
            </div>
        </section>
    );
}
