import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { InternalNoteForm } from "@/components/dashboard/operations/InternalNoteForm";
import { BackLink, DataState, DetailField, DetailGrid, NotesPanel } from "@/components/dashboard/operations/RecordPanels";
import { getCustomer, listCustomerBookings, listCustomerConversations, listCustomerEnquiries, listCustomerNotes } from "@/lib/dashboard/operations/queries";

export const metadata: Metadata = { title: "Customer details | AIMILLE VOYAGES", robots: { index: false, follow: false } };

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const parsed = z.string().uuid().safeParse((await params).id);
    if (!parsed.success) notFound();

    const customerResult = await getCustomer(parsed.data);
    if (customerResult.error) {
        return <section className="space-y-7"><BackLink href="/dashboard/customers">All customers</BackLink><DataState kind="error" title="Customer is unavailable" detail="This record could not be loaded through your current staff session." /></section>;
    }
    if (!customerResult.data) notFound();
    const customer = customerResult.data;
    const [enquiries, bookings, conversations, notes] = await Promise.all([
        listCustomerEnquiries(customer.id),
        listCustomerBookings(customer.id),
        listCustomerConversations(customer.id),
        listCustomerNotes(customer.id),
    ]);

    return (
        <section className="space-y-7">
            <BackLink href="/dashboard/customers">All customers</BackLink>
            <DashboardPageHeader eyebrow="Customer profile" title={customer.full_name} description={customer.company || "Guest relationship record"} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
                <div className="space-y-6">
                    <section className="overflow-hidden border border-border bg-card">
                        <h2 className="border-b border-border px-5 py-4 font-serif text-xl text-primary">Contact information</h2>
                        <DetailGrid>
                            <DetailField label="Email"><a className="text-primary underline-offset-4 hover:underline" href={`mailto:${customer.email}`}>{customer.email}</a></DetailField>
                            <DetailField label="Telephone">{customer.phone ? <a className="text-primary underline-offset-4 hover:underline" href={`tel:${customer.phone}`}>{customer.phone}</a> : null}</DetailField>
                            <DetailField label="Country">{customer.country}</DetailField>
                            <DetailField label="Company">{customer.company}</DetailField>
                            <DetailField label="Created">{new Date(customer.created_at).toLocaleDateString()}</DetailField>
                            <DetailField label="Last updated">{new Date(customer.updated_at).toLocaleDateString()}</DetailField>
                        </DetailGrid>
                    </section>
                    <section className="border border-border bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><h2 className="font-serif text-xl text-primary">Enquiries</h2><span className="text-xs text-muted-foreground">{enquiries.data?.length ?? 0} shown</span></div>
                        {enquiries.error ? <p className="p-5 text-sm text-muted-foreground">Enquiry history is unavailable.</p> : enquiries.data?.length ? <ul className="divide-y divide-border">{enquiries.data.map((enquiry) => <li key={enquiry.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5"><div className="min-w-0"><Link className="font-medium text-primary hover:underline" href={`/dashboard/enquiries/${enquiry.id}`}>{enquiry.destination || enquiry.category}</Link><p className="mt-1 text-xs text-muted-foreground">{new Date(enquiry.created_at).toLocaleDateString()} · {enquiry.category}</p></div><StatusBadge status={enquiry.status} /></li>)}</ul> : <p className="p-5 text-sm text-muted-foreground">No enquiries are associated with this customer.</p>}
                    </section>
                    <section className="border border-border bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><h2 className="font-serif text-xl text-primary">Bookings</h2><span className="text-xs text-muted-foreground">{bookings.data?.length ?? 0} shown</span></div>
                        {bookings.error ? <p className="p-5 text-sm text-muted-foreground">Booking history is unavailable.</p> : bookings.data?.length ? <ul className="divide-y divide-border">{bookings.data.map((booking) => <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5"><div className="min-w-0"><Link className="font-medium text-primary hover:underline" href={`/dashboard/bookings/${booking.id}`}>{booking.booking_reference}</Link><p className="mt-1 text-xs text-muted-foreground">{booking.destination || "Destination not set"} · {booking.arrival_date || "Dates not set"}</p></div><StatusBadge status={booking.status} /></li>)}</ul> : <p className="p-5 text-sm text-muted-foreground">No bookings are associated with this customer.</p>}
                    </section>
                    <section className="border border-border bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><h2 className="font-serif text-xl text-primary">Conversations</h2><span className="text-xs text-muted-foreground">{conversations.data?.length ?? 0} shown</span></div>
                        {conversations.error ? <p className="p-5 text-sm text-muted-foreground">Conversation history is unavailable.</p> : conversations.data?.length ? <ul className="divide-y divide-border">{conversations.data.map((conversation) => <li key={conversation.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5"><div><Link className="font-medium text-primary hover:underline" href={`/dashboard/messages/${conversation.id}`}>{conversation.subject || "Conversation"}</Link><p className="mt-1 text-xs text-muted-foreground">{conversation.channel} · {new Date(conversation.last_message_at).toLocaleString()}</p></div><StatusBadge status={conversation.status} /></li>)}</ul> : <p className="p-5 text-sm text-muted-foreground">No conversations are associated with this customer.</p>}
                    </section>
                </div>
                <aside className="space-y-6">
                    <section className="border border-border bg-card p-5 sm:p-6"><p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-readable">Direct contact</p><h2 className="mt-2 font-serif text-xl text-primary">Reach {customer.full_name.split(" ")[0]}</h2><div className="mt-4 flex flex-wrap gap-3"><a className="inline-flex min-h-10 items-center border border-border px-4 text-sm text-primary transition-colors hover:bg-muted" href={`mailto:${customer.email}`}>Email customer</a>{customer.phone && <a className="inline-flex min-h-10 items-center border border-border px-4 text-sm text-primary transition-colors hover:bg-muted" href={`tel:${customer.phone}`}>Call customer</a>}</div></section>
                    <NotesPanel notes={notes.data ?? []} error={Boolean(notes.error)} form={<InternalNoteForm kind="customer" id={customer.id} />} />
                </aside>
            </div>
        </section>
    );
}
