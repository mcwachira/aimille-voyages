import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { InternalNoteForm } from "@/components/dashboard/operations/InternalNoteForm";
import { RecordStatusForm } from "@/components/dashboard/operations/RecordStatusForm";
import { BackLink, DataState, DetailField, DetailGrid, NotesPanel } from "@/components/dashboard/operations/RecordPanels";
import { getBooking, listBookingNotes, listBookingStatuses } from "@/lib/dashboard/operations/queries";

export const metadata: Metadata = { title: "Booking details | AIMILLE VOYAGES", robots: { index: false, follow: false } };

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const parsed = z.string().uuid().safeParse((await params).id);
    if (!parsed.success) notFound();

    const bookingResult = await getBooking(parsed.data);
    if (bookingResult.error) {
        return <section className="space-y-7"><BackLink href="/dashboard/bookings">All bookings</BackLink><DataState kind="error" title="Booking is unavailable" detail="This record could not be loaded through your current staff session." /></section>;
    }
    if (!bookingResult.data) notFound();
    const booking = bookingResult.data;
    const [notesResult, statusesResult] = await Promise.all([
        listBookingNotes(booking.id),
        listBookingStatuses(),
    ]);

    return (
        <section className="space-y-7">
            <BackLink href="/dashboard/bookings">All bookings</BackLink>
            <DashboardPageHeader eyebrow="Booking record" title={booking.booking_reference} description={`${booking.destination || "Destination not set"}${booking.service_category ? ` · ${booking.service_category}` : ""}`} action={<StatusBadge status={booking.status} />} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
                <div className="space-y-6">
                    <section className="overflow-hidden border border-border bg-card">
                        <h2 className="border-b border-border px-5 py-4 font-serif text-xl text-primary">Trip arrangements</h2>
                        <DetailGrid>
                            <DetailField label="Destination">{booking.destination}</DetailField>
                            <DetailField label="Service category">{booking.service_category}</DetailField>
                            <DetailField label="Arrival date">{booking.arrival_date}</DetailField>
                            <DetailField label="Departure date">{booking.departure_date}</DetailField>
                            <DetailField label="Adults">{booking.adults}</DetailField>
                            <DetailField label="Children">{booking.children}</DetailField>
                            <DetailField label="Services">{booking.services.length ? booking.services.join(", ") : null}</DetailField>
                            <DetailField label="Customer confirmed">{booking.customer_confirmed ? "Yes" : "No"}</DetailField>
                            <DetailField label="Supplier confirmation">{booking.supplier_confirmation_status}</DetailField>
                            <DetailField label="Archived">{booking.archived ? "Yes" : "No"}</DetailField>
                            <DetailField label="Accommodation requirements">{booking.accommodation_requirements}</DetailField>
                            <DetailField label="Transport requirements">{booking.transport_requirements}</DetailField>
                        </DetailGrid>
                    </section>
                    <NotesPanel notes={notesResult.data ?? []} error={Boolean(notesResult.error)} form={<InternalNoteForm kind="booking" id={booking.id} />} />
                </div>
                <aside className="space-y-6">
                    <section className="border border-border bg-card p-5 sm:p-6">
                        <RecordStatusForm kind="booking" id={booking.id} currentStatus={booking.status} availableStatuses={statusesResult.data ?? []} />
                    </section>
                    <section className="border border-border bg-card p-5 sm:p-6">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-readable">Related records</p>
                        <h2 className="mt-2 font-serif text-xl text-primary">Trip contacts</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            {booking.customer_id ? <div><Link className="block font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/customers/${booking.customer_id}`}>{booking.customers?.full_name || "Open customer profile"}</Link>{booking.customers?.email && <a className="mt-1 block break-all text-xs text-muted-foreground hover:underline" href={`mailto:${booking.customers.email}`}>{booking.customers.email}</a>}{booking.customers?.phone && <a className="mt-1 block text-xs text-muted-foreground hover:underline" href={`tel:${booking.customers.phone}`}>{booking.customers.phone}</a>}</div> : <p className="text-muted-foreground">No customer is linked to this booking.</p>}
                            {booking.enquiry_id ? <div><Link className="block font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/enquiries/${booking.enquiry_id}`}>{booking.enquiries?.client_name || "Open originating enquiry"}</Link>{booking.enquiries && <p className="mt-1 text-xs text-muted-foreground">{booking.enquiries.category}{booking.enquiries.destination ? ` · ${booking.enquiries.destination}` : ""}</p>}{booking.enquiries?.email && <a className="mt-1 block break-all text-xs text-muted-foreground hover:underline" href={`mailto:${booking.enquiries.email}`}>{booking.enquiries.email}</a>}</div> : <p className="text-muted-foreground">No enquiry is linked to this booking.</p>}
                        </div>
                    </section>
                    <section className="border border-border bg-card p-5 sm:p-6"><p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Record history</p><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">Created</dt><dd className="mt-1">{new Date(booking.created_at).toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Last updated</dt><dd className="mt-1">{new Date(booking.updated_at).toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Assigned to</dt><dd className="mt-1">{booking.assigned_to || "Not assigned"}</dd></div><div><dt className="text-xs text-muted-foreground">Created by</dt><dd className="mt-1">{booking.created_by || "Not recorded"}</dd></div></dl></section>
                </aside>
            </div>
        </section>
    );
}
