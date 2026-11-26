import { MessageCircle } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

import { ConversationList } from "./ConversationList";

export const metadata = {
    title: "Messages | AIMILLE VOYAGES Dashboard",
    robots: { index: false, follow: false },
};

export default async function MessagesPage() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("conversations")
        .select("id, subject, channel, status, unread, last_message_at, customer_id, enquiry_id, booking_id, customers(full_name, email)")
        .order("last_message_at", { ascending: false })
        .limit(100);

    const conversations = (data ?? []).map((row) => ({
        id: row.id,
        subject: row.subject,
        channel: row.channel,
        status: row.status,
        unread: row.unread,
        lastMessageAt: row.last_message_at,
        customerName: row.customers?.full_name ?? "Customer",
        customerEmail: row.customers?.email ?? null,
    }));

    return (
        <div className="w-full py-8">
            <DashboardPageHeader
                eyebrow="Customer care"
                title="Messages"
                description="Review customer conversations and keep internal follow-up notes together. Replies composed here are not sent externally."
            />

            {error ? (
                <section role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
                    Conversations could not be loaded. Check your access and try again.
                </section>
            ) : conversations.length === 0 ? (
                <section className="mt-8 rounded-2xl border border-dashed border-[#D7C8A7] bg-white/60 p-8 sm:p-12">
                    <MessageCircle aria-hidden="true" className="h-8 w-8 text-[#B69A62]" />
                    <h2 className="mt-4 font-serif text-2xl text-[#123C2D]">No conversations yet</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                        Customer conversations associated with enquiries and bookings will appear here when available to your account.
                    </p>
                </section>
            ) : (
                <ConversationList conversations={conversations} />
            )}
        </div>
    );
}
