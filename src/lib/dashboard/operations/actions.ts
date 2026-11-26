"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { TablesInsert } from "@/integrations/supabase/types";

export type OperationActionState = {
    status: "idle" | "success" | "error";
    message: string;
    bookingId?: string;
};

const statusSchema = z.object({
    id: z.string().uuid("This record is invalid."),
    status: z.string().trim().min(1, "Choose a status.").max(80, "Status is too long."),
});

const noteSchema = z.object({
    id: z.string().uuid("This record is invalid."),
    note: z.string().trim().min(1, "Enter a note.").max(5000, "Notes must be 5,000 characters or fewer."),
});

async function getVisibleStatuses(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], table: "enquiries" | "bookings") {
    const statuses = new Set<string>();
    for (let page = 0; page < 100; page += 1) {
        const { data, error } = table === "enquiries"
            ? await supabase.from("enquiries").select("status").range(page * 500, page * 500 + 499)
            : await supabase.from("bookings").select("status").range(page * 500, page * 500 + 499);
        if (error || !data) return null;
        data.forEach((row) => { if (row.status) statuses.add(row.status); });
        if (data.length < 500) break;
    }
    return statuses;
}

async function authorize() {
    try {
        return await requireAdmin();
    } catch {
        return null;
    }
}

export async function updateEnquiryStatus(
    _previous: OperationActionState,
    formData: FormData,
): Promise<OperationActionState> {
    const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
    if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the selected status." };

    const session = await authorize();
    if (!session) return { status: "error", message: "Your session has expired. Sign in again to continue." };

    const visibleStatuses = await getVisibleStatuses(session.supabase, "enquiries");
    if (!visibleStatuses?.has(parsed.data.status)) {
        return { status: "error", message: "That status is unavailable for records you can access." };
    }

    const { data, error } = await session.supabase
        .from("enquiries")
        .update({ status: parsed.data.status })
        .eq("id", parsed.data.id)
        .select("id")
        .maybeSingle();
    if (error || !data) return { status: "error", message: "The enquiry could not be updated. Your access may not allow this change." };

    revalidatePath("/dashboard/enquiries");
    revalidatePath(`/dashboard/enquiries/${parsed.data.id}`);
    revalidatePath("/dashboard");
    return { status: "success", message: "Enquiry status updated." };
}

export async function updateBookingStatus(
    _previous: OperationActionState,
    formData: FormData,
): Promise<OperationActionState> {
    const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
    if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the selected status." };

    const session = await authorize();
    if (!session) return { status: "error", message: "Your session has expired. Sign in again to continue." };

    const visibleStatuses = await getVisibleStatuses(session.supabase, "bookings");
    if (!visibleStatuses?.has(parsed.data.status)) {
        return { status: "error", message: "That status is unavailable for records you can access." };
    }

    const { data, error } = await session.supabase
        .from("bookings")
        .update({ status: parsed.data.status })
        .eq("id", parsed.data.id)
        .select("id")
        .maybeSingle();
    if (error || !data) return { status: "error", message: "The booking could not be updated. Your access may not allow this change." };

    revalidatePath("/dashboard/bookings");
    revalidatePath(`/dashboard/bookings/${parsed.data.id}`);
    revalidatePath("/dashboard");
    return { status: "success", message: "Booking status updated." };
}

export async function createBookingFromEnquiry(
    _previous: OperationActionState,
    formData: FormData,
): Promise<OperationActionState> {
    const parsed = z.string().uuid("This enquiry is invalid.").safeParse(formData.get("id"));
    if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "This enquiry is invalid." };

    const session = await authorize();
    if (!session) return { status: "error", message: "Your session has expired. Sign in again to continue." };

    const { data: enquiry, error: enquiryError } = await session.supabase
        .from("enquiries")
        .select("id, customer_id, destination, category, arrival_date, departure_date, adults, children, services")
        .eq("id", parsed.data)
        .maybeSingle();
    if (enquiryError || !enquiry) {
        return { status: "error", message: "This enquiry is unavailable through your current staff session." };
    }

    const { data: existingBookings, error: existingError } = await session.supabase
        .from("bookings")
        .select("id")
        .eq("enquiry_id", enquiry.id)
        .limit(1);
    if (existingError) {
        return { status: "error", message: "Related bookings could not be checked. Try again later." };
    }
    if (existingBookings?.[0]) {
        return { status: "success", message: "A booking is already linked to this enquiry.", bookingId: existingBookings[0].id };
    }

    const booking: TablesInsert<"bookings"> = {
        enquiry_id: enquiry.id,
        customer_id: enquiry.customer_id,
        destination: enquiry.destination,
        service_category: enquiry.category,
        arrival_date: enquiry.arrival_date,
        departure_date: enquiry.departure_date,
        adults: enquiry.adults,
        children: enquiry.children,
        services: enquiry.services,
        created_by: session.user.id,
    };
    const { data, error } = await session.supabase
        .from("bookings")
        .insert(booking)
        .select("id")
        .maybeSingle();
    if (error || !data) {
        return { status: "error", message: "The booking could not be created. Your access may not allow this change." };
    }

    revalidatePath("/dashboard/bookings");
    revalidatePath(`/dashboard/bookings/${data.id}`);
    revalidatePath(`/dashboard/enquiries/${enquiry.id}`);
    revalidatePath("/dashboard");
    return { status: "success", message: "Booking created from this enquiry.", bookingId: data.id };
}

async function addRecordNote(
    formData: FormData,
    relation: "enquiry_id" | "booking_id" | "customer_id",
    detailPath: string,
): Promise<OperationActionState> {
    const parsed = noteSchema.safeParse({ id: formData.get("id"), note: formData.get("note") });
    if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the note and try again." };

    const session = await authorize();
    if (!session) return { status: "error", message: "Your session has expired. Sign in again to continue." };

    const note: TablesInsert<"internal_notes"> = {
        note: parsed.data.note,
        created_by: session.user.id,
        [relation]: parsed.data.id,
    };
    const { error } = await session.supabase.from("internal_notes").insert(note);
    if (error) return { status: "error", message: "The note could not be saved. Your access may not allow this change." };

    revalidatePath(detailPath);
    return { status: "success", message: "Internal note saved." };
}

export async function addEnquiryNote(_previous: OperationActionState, formData: FormData): Promise<OperationActionState> {
    const id = formData.get("id");
    const valid = z.string().uuid().safeParse(id);
    if (!valid.success) return { status: "error", message: "This enquiry is invalid." };
    return addRecordNote(formData, "enquiry_id", `/dashboard/enquiries/${valid.data}`);
}

export async function addBookingNote(_previous: OperationActionState, formData: FormData): Promise<OperationActionState> {
    const id = formData.get("id");
    const valid = z.string().uuid().safeParse(id);
    if (!valid.success) return { status: "error", message: "This booking is invalid." };
    return addRecordNote(formData, "booking_id", `/dashboard/bookings/${valid.data}`);
}

export async function addCustomerNote(_previous: OperationActionState, formData: FormData): Promise<OperationActionState> {
    const id = formData.get("id");
    const valid = z.string().uuid().safeParse(id);
    if (!valid.success) return { status: "error", message: "This customer is invalid." };
    return addRecordNote(formData, "customer_id", `/dashboard/customers/${valid.data}`);
}
