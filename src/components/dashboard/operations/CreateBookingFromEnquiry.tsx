"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { createBookingFromEnquiry, type OperationActionState } from "@/lib/dashboard/operations/actions";

const initialState: OperationActionState = { status: "idle", message: "" };

export function CreateBookingFromEnquiry({ enquiryId }: { enquiryId: string }) {
    const [state, formAction, pending] = useActionState(createBookingFromEnquiry, initialState);

    return (
        <form action={formAction} className="mt-4 space-y-3">
            <input type="hidden" name="id" value={enquiryId} />
            <Button type="submit" variant="brand" size="lg" disabled={pending}>
                {pending ? "Creating booking…" : "Create booking from enquiry"}
            </Button>
            {state.message && <p role={state.status === "error" ? "alert" : "status"} className="text-sm text-muted-foreground">{state.message}</p>}
            {state.bookingId && <Link className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/bookings/${state.bookingId}`}>Open booking</Link>}
            <p className="text-xs leading-5 text-muted-foreground">Travel details are copied from this enquiry. The enquiry status is unchanged, and the booking is subject to database access policies.</p>
        </form>
    );
}
