import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdmin } from "@/lib/auth/require-admin";
import { addCustomerNote, createBookingFromEnquiry, updateEnquiryStatus } from "./actions";

vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function form(fields: Record<string, string>) {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
}

describe("operational server actions", () => {
    beforeEach(() => vi.clearAllMocks());

    function authorize(client: unknown) {
        vi.mocked(requireAdmin).mockResolvedValue({ supabase: client, user: { id: "verified-staff-id" } } as never);
    }

    it("rejects a status value absent from RLS-visible records", async () => {
        const update = vi.fn();
        const range = vi.fn().mockResolvedValue({ data: [{ status: "new" }], error: null });
        const client = {
            from: vi.fn(() => ({
                select: vi.fn(() => ({ range })),
                update,
            })),
        };
        authorize(client);

        const result = await updateEnquiryStatus({ status: "idle", message: "" }, form({ id: "8db02441-1bcf-4d5c-9795-343d508cdd44", status: "invented" }));
        expect(result.status).toBe("error");
        expect(update).not.toHaveBeenCalled();
    });

    it("binds an internal note to the authenticated user and supplied customer record", async () => {
        const insert = vi.fn().mockResolvedValue({ error: null });
        const client = { from: vi.fn(() => ({ insert })) };
        authorize(client);

        const result = await addCustomerNote({ status: "idle", message: "" }, form({ id: "8db02441-1bcf-4d5c-9795-343d508cdd44", note: "Follow up next week" }));
        expect(result.status).toBe("success");
        expect(insert).toHaveBeenCalledWith({
            note: "Follow up next week",
            created_by: "verified-staff-id",
            customer_id: "8db02441-1bcf-4d5c-9795-343d508cdd44",
        });
    });

    it("rejects an empty note before using the database", async () => {
        const client = { from: vi.fn() };
        authorize(client);
        const result = await addCustomerNote({ status: "idle", message: "" }, form({ id: "8db02441-1bcf-4d5c-9795-343d508cdd44", note: " " }));
        expect(result.status).toBe("error");
        expect(requireAdmin).not.toHaveBeenCalled();
    });

    it("creates a booking linked to the enquiry using only its existing travel fields", async () => {
        const enquiry = {
            id: "8db02441-1bcf-4d5c-9795-343d508cdd44",
            customer_id: "109bd2f7-5903-4a1c-96ab-17bca892b83d",
            destination: "Zanzibar",
            category: "Long stay",
            arrival_date: "2026-12-01",
            departure_date: "2027-01-01",
            adults: 2,
            children: 1,
            services: ["Accommodation"],
        };
        const maybeSingleEnquiry = vi.fn().mockResolvedValue({ data: enquiry, error: null });
        const enquiryEq = vi.fn(() => ({ maybeSingle: maybeSingleEnquiry }));
        const enquirySelect = vi.fn(() => ({ eq: enquiryEq }));
        const noExistingBookings = vi.fn().mockResolvedValue({ data: [], error: null });
        const bookingCheckEq = vi.fn(() => ({ limit: noExistingBookings }));
        const bookingSelect = vi.fn(() => ({ eq: bookingCheckEq }));
        const createdBooking = vi.fn().mockResolvedValue({ data: { id: "dce19bba-ab64-45a9-a0b6-8ab0ce13f20c" }, error: null });
        const insertSelect = vi.fn(() => ({ maybeSingle: createdBooking }));
        const insert = vi.fn(() => ({ select: insertSelect }));
        const client = {
            from: vi.fn((table: string) => table === "enquiries"
                ? { select: enquirySelect }
                : { select: bookingSelect, insert }),
        };
        authorize(client);

        const result = await createBookingFromEnquiry({ status: "idle", message: "" }, form({ id: enquiry.id }));

        expect(result).toMatchObject({ status: "success", bookingId: "dce19bba-ab64-45a9-a0b6-8ab0ce13f20c" });
        expect(insert).toHaveBeenCalledWith({
            enquiry_id: enquiry.id,
            customer_id: enquiry.customer_id,
            destination: "Zanzibar",
            service_category: "Long stay",
            arrival_date: "2026-12-01",
            departure_date: "2027-01-01",
            adults: 2,
            children: 1,
            services: ["Accommodation"],
            created_by: "verified-staff-id",
        });
    });

    it("does not create a second booking when the enquiry is already linked", async () => {
        const enquiry = {
            id: "8db02441-1bcf-4d5c-9795-343d508cdd44",
            customer_id: null,
            destination: null,
            category: "General",
            arrival_date: null,
            departure_date: null,
            adults: null,
            children: null,
            services: [],
        };
        const insert = vi.fn();
        const client = {
            from: vi.fn((table: string) => table === "enquiries"
                ? { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: enquiry, error: null }) })) })) }
                : {
                    select: vi.fn(() => ({ eq: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [{ id: "existing-booking-id" }], error: null }) })) })),
                    insert,
                }),
        };
        authorize(client);

        const result = await createBookingFromEnquiry({ status: "idle", message: "" }, form({ id: enquiry.id }));

        expect(result).toMatchObject({ status: "success", bookingId: "existing-booking-id" });
        expect(insert).not.toHaveBeenCalled();
    });

    it("rejects direct mutation calls from non-admin users before data access", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new Error("forbidden"));
        const result = await updateEnquiryStatus(
            { status: "idle", message: "" },
            form({ id: "8db02441-1bcf-4d5c-9795-343d508cdd44", status: "new" }),
        );
        expect(result.status).toBe("error");
        expect(requireAdmin).toHaveBeenCalledOnce();
    });
});
