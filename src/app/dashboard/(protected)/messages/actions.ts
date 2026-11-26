"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { conversationNoteSchema } from "@/lib/dashboard/messages/validation";

export type NoteActionState = {
    status: "idle" | "success" | "error";
    message: string;
};

export async function markConversationRead(_previousState: NoteActionState, formData: FormData): Promise<NoteActionState> {
    const parsed = z.string().uuid("This conversation is invalid.").safeParse(formData.get("conversationId"));
    if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "This conversation is invalid." };

    let admin;
    try {
        admin = await requireAdmin();
    } catch {
        return { status: "error", message: "Your session has expired. Sign in again to continue." };
    }
    const { supabase } = admin;

    const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .select("id, unread")
        .eq("id", parsed.data)
        .maybeSingle();
    if (conversationError || !conversation) {
        return { status: "error", message: "This conversation is unavailable." };
    }
    if (!conversation.unread) {
        return { status: "success", message: "This conversation is already marked as read." };
    }

    const { data, error } = await supabase
        .from("conversations")
        .update({ unread: false })
        .eq("id", conversation.id)
        .select("id")
        .maybeSingle();
    if (error || !data) {
        return { status: "error", message: "The read state could not be updated. Your access may not allow this change." };
    }

    revalidatePath("/dashboard/messages");
    revalidatePath(`/dashboard/messages/${conversation.id}`);
    return { status: "success", message: "Conversation marked as read." };
}

export async function addConversationNote(
    _previousState: NoteActionState,
    formData: FormData,
): Promise<NoteActionState> {
    const parsed = conversationNoteSchema.safeParse({
        conversationId: formData.get("conversationId"),
        note: formData.get("note"),
    });

    if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the note and try again." };
    }

    let admin;
    try {
        admin = await requireAdmin();
    } catch {
        return { status: "error", message: "Your session has expired. Sign in again to add a note." };
    }
    const { supabase, user } = admin;

    const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .select("id, customer_id, enquiry_id, booking_id")
        .eq("id", parsed.data.conversationId)
        .maybeSingle();

    if (conversationError || !conversation) {
        return { status: "error", message: "This conversation is unavailable." };
    }

    const { error } = await supabase.from("internal_notes").insert({
        note: parsed.data.note,
        created_by: user.id,
        customer_id: conversation.customer_id,
        enquiry_id: conversation.enquiry_id,
        booking_id: conversation.booking_id,
    });

    if (error) {
        // RLS remains authoritative; this action never bypasses it.
        return { status: "error", message: "The note could not be saved. Your access may not allow this change." };
    }

    revalidatePath(`/dashboard/messages/${parsed.data.conversationId}`);
    return { status: "success", message: "Internal note saved." };
}
