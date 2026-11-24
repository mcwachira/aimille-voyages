
import { z } from "zod";

export const ENQUIRY_CATEGORIES = [
    "trip_planner",
    "holiday",
    "accommodation",
    "transport",
    "experiences",
    "long_stay",
    "corporate",
    "contact",
] as const;

function isCalendarDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function getKenyaDate() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Nairobi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

    return `${values.year}-${values.month}-${values.day}`;
}

const dateStr = z
    .string()
    .refine(isCalendarDate, "Please enter a valid date")
    .refine((value) => value >= getKenyaDate(), "Travel date cannot be in the past")
    .optional()
    .or(z.literal("").transform(() => undefined));

const optText = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .optional()
        .transform((value) => (value ? value : undefined));

export const enquirySchema = z
    .object({
        category: z.enum(ENQUIRY_CATEGORIES),

        client_name: z
            .string()
            .trim()
            .min(1, "Please enter your name")
            .max(200),

        email: z
            .string()
            .trim()
            .email("Please enter a valid email")
            .max(255),

        phone: z
            .string()
            .trim()
            .max(50)
            .optional()
            .or(z.literal("").transform(() => undefined))
            .refine((value) => {
                if (!value) return true;
                if (!/^\+?[0-9\s().-]+$/.test(value)) return false;

                const digits = value.replace(/\D/g, "");
                return digits.length >= 7 && digits.length <= 15;
            }, "Please enter a valid phone or WhatsApp number"),
        country: optText(100),
        company: optText(200),
        destination: optText(200),

        arrival_date: dateStr,
        departure_date: dateStr,

        dates_flexible: z.boolean().optional().default(false),

        adults: z.number().int().min(0).max(1000).optional(),
        children: z.number().int().min(0).max(1000).optional(),

        budget: optText(100),
        currency: optText(10),

        services: z
            .array(z.string().max(80))
            .max(20)
            .optional()
            .default([]),

        preferences: optText(2000),
        notes: optText(4000),

        details: z
            .record(z.string().max(80), z.string().max(2000))
            .optional()
            .default({}),

        source_page: optText(200),

        consent: z.literal(true, {
            message: "Please accept the privacy notice",
        }),

        website: z.string().max(0).optional(),
    })
    .refine(
        (data) =>
            !data.arrival_date ||
            !data.departure_date ||
            data.departure_date >= data.arrival_date,
        {
            message: "Departure date cannot be earlier than arrival date",
            path: ["departure_date"],
        },
    )
    .refine(
        (data) =>
            data.category !== "corporate" ||
            Boolean(data.company?.trim()),
        {
            message: "Please enter your company or organisation",
            path: ["company"],
        },
    )
    .refine(
        (data) => data.category !== "trip_planner" || data.services.length > 0,
        {
            message: "Please choose at least one service",
            path: ["services"],
        },
    )
    .refine(
        (data) => data.category !== "trip_planner" || (data.adults ?? 0) >= 1,
        {
            message: "Please enter at least one adult traveller",
            path: ["adults"],
        },
    )
    .refine(
        (data) => data.category !== "contact" || Boolean(data.notes?.trim()),
        {
            message: "Please tell us how we can help",
            path: ["notes"],
        },
    )
    .refine(
        (data) =>
            data.category !== "transport" ||
            Boolean(data.details["Pickup location"]?.trim()),
        {
            message: "Please provide a pickup location",
            path: ["details", "Pickup location"],
        },
    )
    .refine(
        (data) =>
            data.category !== "transport" ||
            Boolean(data.details["Drop-off location"]?.trim()),
        {
            message: "Please provide a drop-off location",
            path: ["details", "Drop-off location"],
        },
    );

export const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

export type EnquiryInput = z.input<typeof enquirySchema>;
export type ValidatedEnquiry = z.output<typeof enquirySchema>;
