"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type ConversationRow = {
    id: string;
    subject: string | null;
    channel: string;
    status: string;
    unread: boolean;
    lastMessageAt: string;
    customerName: string;
    customerEmail: string | null;
};

export function ConversationList({ conversations }: { conversations: ConversationRow[] }) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const rows = useMemo(() => conversations.filter((conversation) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchesQuery = !normalizedQuery || [
            conversation.customerName,
            conversation.customerEmail ?? "",
            conversation.subject ?? "",
            conversation.channel,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
        return matchesQuery && (status === "all" || conversation.status.toLowerCase() === status);
    }), [conversations, query, status]);

    return (
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#D7C8A7]/70 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[#D7C8A7]/50 p-4 sm:flex-row">
                <label className="relative flex-1">
                    <span className="sr-only">Search conversations</span>
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search name, email or subject"
                        className="h-11 w-full rounded-lg border border-[#D7C8A7] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/15"
                    />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="sr-only">Filter by status</span>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-11 min-w-36 rounded-lg border border-[#D7C8A7] bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/15"
                    >
                        <option value="all">All statuses</option>
                        {[...new Set(conversations.map((conversation) => conversation.status.toLowerCase()))].map((value) => (
                            <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
                        ))}
                    </select>
                </label>
            </div>
            {rows.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-600">No conversations match those filters.</p>
            ) : (
                <ul className="divide-y divide-[#D7C8A7]/40">
                    {rows.map((conversation) => (
                        <li key={conversation.id}>
                            <Link href={`/dashboard/messages/${conversation.id}`} className="flex min-h-24 items-center gap-4 px-4 py-4 transition hover:bg-[#F3EFE5]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#123C2D] sm:px-6">
                                <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${conversation.unread ? "bg-[#B69A62]" : "bg-slate-200"}`} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <span className="sr-only">{conversation.unread ? "Unread conversation" : "Read conversation"}</span>
                                        <h2 className={`truncate text-sm text-[#123C2D] ${conversation.unread ? "font-semibold" : "font-medium"}`}>{conversation.customerName}</h2>
                                        <span className="rounded-full bg-[#F3EFE5] px-2 py-0.5 text-[11px] capitalize text-slate-600">{conversation.channel.replaceAll("_", " ")}</span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-slate-600">{conversation.subject || "Conversation"}</p>
                                    <p className="mt-1 truncate text-xs text-slate-500">{conversation.customerEmail || "No email on file"}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className="inline-flex rounded-full border border-[#D7C8A7] px-2.5 py-1 text-xs capitalize text-slate-600">{conversation.status.replaceAll("_", " ")}</span>
                                    <time className="mt-2 block text-xs text-slate-500" dateTime={conversation.lastMessageAt}>{new Date(conversation.lastMessageAt).toLocaleDateString()}</time>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <p className="border-t border-[#D7C8A7]/40 px-4 py-3 text-xs text-slate-500 sm:px-6">Showing the most recent {conversations.length} conversations available to your account.</p>
        </section>
    );
}
