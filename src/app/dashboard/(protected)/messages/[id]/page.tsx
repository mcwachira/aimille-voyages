import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

import { MarkConversationReadForm } from "../MarkConversationReadForm";
import { NoteForm } from "../NoteForm";

type PageProps = { params: Promise<{ id: string }> };

export const metadata = {
    title: "Conversation | AIMILLE VOYAGES Dashboard",
    robots: { index: false, follow: false },
};

export default async function ConversationPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: conversation, error } = await supabase
        .from("conversations")
        .select("id, subject, channel, status, unread, created_at, customer_id, enquiry_id, booking_id, customers(full_name, email, phone), messages(id, message_body, sender_type, direction, channel, delivery_status, created_at)")
        .eq("id", id)
        .maybeSingle();

    if (error || !conversation) notFound();

    const [customerNotes, enquiryNotes, bookingNotes] = await Promise.all([
        conversation.customer_id
            ? supabase.from("internal_notes").select("id, note, created_at, created_by").eq("customer_id", conversation.customer_id)
            : Promise.resolve({ data: [], error: null }),
        conversation.enquiry_id
            ? supabase.from("internal_notes").select("id, note, created_at, created_by").eq("enquiry_id", conversation.enquiry_id)
            : Promise.resolve({ data: [], error: null }),
        conversation.booking_id
            ? supabase.from("internal_notes").select("id, note, created_at, created_by").eq("booking_id", conversation.booking_id)
            : Promise.resolve({ data: [], error: null }),
    ]);
    const notes = new Map<string, { id: string; note: string; created_at: string; created_by: string | null }>();
    for (const row of [...(customerNotes.data ?? []), ...(enquiryNotes.data ?? []), ...(bookingNotes.data ?? [])]) {
        notes.set(row.id, row);
    }
    const orderedNotes = [...notes.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const customer = conversation.customers;
    const phoneDigits = customer?.phone?.replace(/\D/g, "") ?? "";

    return (
        <div className="w-full py-8">
            <Link href="/dashboard/messages" className="mb-5 inline-flex items-center gap-2 text-sm text-[#123C2D] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123C2D]">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All conversations
            </Link>
            <DashboardPageHeader
                eyebrow={`${conversation.channel.replaceAll("_", " ")} · ${conversation.status.replaceAll("_", " ")}`}
                title={conversation.subject || customer?.full_name || "Conversation"}
                description={customer?.full_name ? `Conversation with ${customer.full_name}` : "Customer conversation details"}
                action={conversation.unread ? <MarkConversationReadForm conversationId={conversation.id} /> : <span className="text-sm text-slate-500">Marked as read</span>}
            />

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-6">
                    <section aria-labelledby="history-title" className="rounded-2xl border border-[#D7C8A7]/70 bg-white shadow-sm">
                        <div className="flex items-center justify-between gap-3 border-b border-[#D7C8A7]/50 px-5 py-4">
                            <h2 id="history-title" className="font-serif text-xl text-[#123C2D]">Conversation history</h2>
                            <span className="text-xs capitalize text-slate-500">{conversation.channel.replaceAll("_", " ")}</span>
                        </div>
                        {conversation.messages.length ? (
                            <ol className="space-y-4 p-4 sm:p-6">
                                {[...conversation.messages].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((message) => {
                                    const outgoing = message.direction.toLowerCase() === "outbound";
                                    return (
                                        <li key={message.id} className={`flex ${outgoing ? "justify-end" : "justify-start"}`}>
                                            <article className={`max-w-[min(90%,42rem)] rounded-2xl px-4 py-3 ${outgoing ? "bg-[#123C2D] text-white" : "bg-[#F3EFE5] text-slate-800"}`}>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-75">
                                                    <span className="capitalize">{message.sender_type.replaceAll("_", " ")}</span>
                                                    <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time>
                                                </div>
                                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{message.message_body}</p>
                                                {outgoing && <p className="mt-2 text-[11px] opacity-75">Delivery: {message.delivery_status.replaceAll("_", " ")}</p>}
                                            </article>
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : (
                            <p className="p-6 text-sm text-slate-600">No message history is available for this conversation.</p>
                        )}
                        <div className="border-t border-[#D7C8A7]/50 bg-[#F3EFE5]/50 px-5 py-4">
                            <p className="text-sm font-medium text-[#123C2D]">Reply draft</p>
                            <textarea disabled rows={3} aria-label="Reply draft (sending not configured)" placeholder="Outbound messaging is not connected. No message will be sent from this dashboard." className="mt-2 w-full resize-y rounded-lg border border-[#D7C8A7] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-50" />
                            <p className="mt-2 text-xs text-slate-500">External email and WhatsApp delivery are not configured here. Use the contact links to reach the customer.</p>
                        </div>
                    </section>

                    <section aria-labelledby="notes-title" className="rounded-2xl border border-[#D7C8A7]/70 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="notes-title" className="font-serif text-xl text-[#123C2D]">Internal notes</h2>
                        <p className="mt-1 text-sm text-slate-600">Notes are staff-only and attached to the related customer, enquiry or booking.</p>
                        {conversation.customer_id || conversation.enquiry_id || conversation.booking_id ? (
                            <NoteForm conversationId={conversation.id} />
                        ) : (
                            <p className="mt-4 rounded-lg bg-[#F3EFE5] p-3 text-sm text-slate-600">This conversation is not linked to a customer, enquiry or booking, so a note cannot be attached.</p>
                        )}
                        {customerNotes.error || enquiryNotes.error || bookingNotes.error ? (
                            <p role="status" className="mt-4 text-sm text-slate-600">Some related notes could not be loaded for this account.</p>
                        ) : orderedNotes.length ? (
                            <ul className="mt-5 space-y-3">
                                {orderedNotes.map((note) => (
                                    <li key={note.id} className="rounded-lg border border-[#D7C8A7]/60 bg-[#F3EFE5]/50 p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{note.note}</p>
                                        <time className="mt-2 block text-xs text-slate-500" dateTime={note.created_at}>{new Date(note.created_at).toLocaleString()}</time>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-5 text-sm text-slate-500">No internal notes yet.</p>
                        )}
                    </section>
                </div>

                <aside aria-label="Customer details" className="h-fit rounded-2xl border border-[#D7C8A7]/70 bg-white p-5 shadow-sm">
                    <h2 className="font-serif text-xl text-[#123C2D]">Customer</h2>
                    <p className="mt-4 font-medium text-slate-900">{customer?.full_name || "Customer details unavailable"}</p>
                    <div className="mt-4 space-y-3 text-sm">
                        {customer?.email && <a className="flex items-center gap-2 text-[#123C2D] underline-offset-4 hover:underline" href={`mailto:${customer.email}`}><Mail aria-hidden="true" className="h-4 w-4" /> {customer.email}</a>}
                        {customer?.phone && <a className="flex items-center gap-2 text-[#123C2D] underline-offset-4 hover:underline" href={`tel:${customer.phone}`}><Phone aria-hidden="true" className="h-4 w-4" /> {customer.phone}</a>}
                        {phoneDigits && <a className="flex items-center gap-2 text-[#123C2D] underline-offset-4 hover:underline" href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" className="h-4 w-4" /> Open WhatsApp</a>}
                        {!customer?.email && !customer?.phone && <p className="text-slate-500">No contact details are available.</p>}
                    </div>
                    {conversation.customer_id && <Link className="mt-4 inline-flex text-sm text-[#123C2D] underline-offset-4 hover:underline" href={`/dashboard/customers/${conversation.customer_id}`}>Open customer profile</Link>}
                    {(conversation.enquiry_id || conversation.booking_id) && (
                        <div className="mt-6 border-t border-[#D7C8A7]/50 pt-5">
                            <h3 className="text-sm font-medium text-[#123C2D]">Linked records</h3>
                            <div className="mt-3 flex flex-col items-start gap-2 text-sm">
                                {conversation.enquiry_id && <Link className="text-[#123C2D] underline-offset-4 hover:underline" href={`/dashboard/enquiries/${conversation.enquiry_id}`}>Open related enquiry</Link>}
                                {conversation.booking_id && <Link className="text-[#123C2D] underline-offset-4 hover:underline" href={`/dashboard/bookings/${conversation.booking_id}`}>Open related booking</Link>}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
