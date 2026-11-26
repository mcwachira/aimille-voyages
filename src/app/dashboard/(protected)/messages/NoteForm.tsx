"use client";

import { useActionState } from "react";

import { addConversationNote, type NoteActionState } from "./actions";

const initialState: NoteActionState = { status: "idle", message: "" };

export function NoteForm({ conversationId }: { conversationId: string }) {
    const [state, action, pending] = useActionState(addConversationNote, initialState);

    return (
        <form action={action} className="mt-4 space-y-3">
            <input type="hidden" name="conversationId" value={conversationId} />
            <label htmlFor="conversation-note" className="block text-sm font-medium text-slate-700">Add a note</label>
            <textarea id="conversation-note" name="note" required maxLength={5000} rows={3} placeholder="Record a staff follow-up or useful context..." className="w-full resize-y rounded-lg border border-[#D7C8A7] bg-white px-3 py-2 text-sm outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/15" />
            {state.message && <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-red-700" : "text-[#123C2D]"}`}>{state.message}</p>}
            <button type="submit" disabled={pending} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#123C2D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#123C2D]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A62] disabled:cursor-wait disabled:opacity-60">
                {pending ? "Saving…" : "Save internal note"}
            </button>
        </form>
    );
}
