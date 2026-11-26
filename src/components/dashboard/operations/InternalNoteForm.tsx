"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addBookingNote, addCustomerNote, addEnquiryNote, type OperationActionState } from "@/lib/dashboard/operations/actions";

const initialState: OperationActionState = { status: "idle", message: "" };

export function InternalNoteForm({ kind, id }: { kind: "enquiry" | "booking" | "customer"; id: string }) {
    const action = kind === "enquiry" ? addEnquiryNote : kind === "booking" ? addBookingNote : addCustomerNote;
    const [state, formAction, pending] = useActionState(action, initialState);
    const noteId = `${kind}-internal-note`;

    return (
        <form action={formAction} className="mt-5 space-y-3 border-t border-border pt-5">
            <input type="hidden" name="id" value={id} />
            <label htmlFor={noteId} className="block text-sm font-medium text-foreground">Add an internal note</label>
            <Textarea id={noteId} name="note" required maxLength={5000} rows={3} placeholder="Record a staff follow-up or useful context…" className="min-h-24 resize-y bg-background text-sm" />
            {state.message && <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{state.message}</p>}
            <Button type="submit" variant="brand" size="lg" disabled={pending}>{pending ? "Saving…" : "Save internal note"}</Button>
            <p className="text-xs leading-5 text-muted-foreground">Notes are stored as internal team records and are not sent to customers. Saving is subject to database access policies.</p>
        </form>
    );
}
