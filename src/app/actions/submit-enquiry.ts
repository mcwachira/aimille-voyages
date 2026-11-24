
"use server";

import "server-only";

import {
    enquirySchema,
    DUPLICATE_WINDOW_MS,
} from "@/lib/enquiry.schema";
import { headers } from "next/headers";
import { limitEnquirySubmission } from "@/lib/rate-limit";

export async function submitEnquiry(input: unknown) {
    // Always validate on the server.
    const parsed = enquirySchema.safeParse(input);

    if (!parsed.success) {
        throw new Error(
            parsed.error.issues[0]?.message ??
            "Please check your enquiry details and try again.",
        );
    }
    

    const data = parsed.data;

    // Reject automated submissions caught by the honeypot.
    if (data.website) {
        throw new Error("We couldn't process your enquiry.");
    }
    // Apply server-side rate limiting using the visitor's IP address.
    const requestHeaders = await headers();

    const forwardedFor = requestHeaders.get("x-forwarded-for");

    const ipAddress =
        forwardedFor?.split(",")[0]?.trim() ||
        requestHeaders.get("x-real-ip")?.trim();

    const identifier =
        ipAddress ||
        (process.env.NODE_ENV === "development"
            ? "local-development"
            : null);

    if (!identifier) {
        throw new Error(
            "We couldn't process your enquiry. Please try again later.",
        );
    }

    try {
        const rateLimit = await limitEnquirySubmission(identifier);

        if (!rateLimit.success) {
            throw new Error(
                "Too many enquiries have been submitted. Please wait a few minutes and try again.",
            );
        }
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.startsWith("Too many enquiries")
        ) {
            throw error;
        }

        // Keep legitimate enquiries available if Upstash is temporarily unavailable.
        console.error("Enquiry rate limiter unavailable:", error);
    }

    // Import the privileged Supabase client only on the server.
    const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
        );

    // Remove fields that should not be stored in the enquiries table.
    const {
        consent,
        website,
        ...row
    } = data;

    // Explicitly consume these validated fields.
    void consent;
    void website;

    // Check for a recent duplicate enquiry.
    const since = new Date(
        Date.now() - DUPLICATE_WINDOW_MS,
    ).toISOString();

    let duplicateQuery = supabaseAdmin
        .from("enquiries")
        .select("id")
        .eq("email", row.email)
        .eq("category", row.category)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1);

    // Preserve the existing duplicate matching behaviour.
    duplicateQuery = row.notes
        ? duplicateQuery.eq("notes", row.notes)
        : duplicateQuery.is("notes", null);

    const {
        data: duplicates,
        error: duplicateError,
    } = await duplicateQuery;

    if (duplicateError) {
        console.error(
            "Enquiry duplicate check failed:",
            duplicateError,
        );

        throw new Error(
            "We couldn't send your enquiry. Please try again or message us on WhatsApp.",
        );
    }

    // Treat an identical recent submission as a successful repeat click.
    if (duplicates && duplicates.length > 0) {
        return {
            id: duplicates[0].id,
            duplicate: true,
        };
    }

    // Insert the new enquiry.
    const {
        data: inserted,
        error: insertError,
    } = await supabaseAdmin
        .from("enquiries")
        .insert(row as never)
        .select("id")
        .single();

    if (insertError) {
        console.error(
            "Enquiry insert failed:",
            insertError,
        );

        throw new Error(
            "We couldn't send your enquiry. Please try again or message us on WhatsApp.",
        );
    }

    return {
        id: inserted.id,
        duplicate: false,
    };
}
