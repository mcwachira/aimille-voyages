"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { updateBookingStatus, updateEnquiryStatus, type OperationActionState } from "@/lib/dashboard/operations/actions";

const initialState: OperationActionState = { status: "idle", message: "" };

export function RecordStatusForm({
    kind,
    id,
    currentStatus,
    availableStatuses,
}: {
    kind: "enquiry" | "booking";
    id: string;
    currentStatus: string;
    availableStatuses: string[];
}) {
    const action = kind === "enquiry" ? updateEnquiryStatus : updateBookingStatus;
    const [state, formAction, pending] = useActionState(action, initialState);
    const statuses = [...new Set([...availableStatuses, currentStatus])].filter(Boolean);

    return (
        <form action={formAction} className="space-y-3">
            <input type="hidden" name="id" value={id} />
            <label className="block text-sm font-medium text-foreground" htmlFor={`${kind}-status`}>Update status</label>
            <div className="flex flex-col gap-2 sm:flex-row">
                <select id={`${kind}-status`} name="status" defaultValue={currentStatus} className="h-10 min-w-0 flex-1 border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
                <Button type="submit" variant="brand" size="lg" disabled={pending}>{pending ? "Saving…" : "Save status"}</Button>
            </div>
            {state.message && <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{state.message}</p>}
            <p className="text-xs leading-5 text-muted-foreground">Only statuses already visible in your records are offered. Changes are still subject to database access policies.</p>
        </form>
    );
}
