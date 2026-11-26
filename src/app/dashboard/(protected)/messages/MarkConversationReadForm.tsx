"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { markConversationRead, type NoteActionState } from "./actions";

const initialState: NoteActionState = { status: "idle", message: "" };

export function MarkConversationReadForm({ conversationId }: { conversationId: string }) {
    const [state, formAction, pending] = useActionState(markConversationRead, initialState);

    return (
        <form action={formAction} className="space-y-2">
            <input type="hidden" name="conversationId" value={conversationId} />
            <Button type="submit" variant="outline" size="lg" disabled={pending}>
                {pending ? "Updating…" : "Mark as read"}
            </Button>
            {state.message && <p role={state.status === "error" ? "alert" : "status"} className="text-xs text-slate-600">{state.message}</p>}
        </form>
    );
}
