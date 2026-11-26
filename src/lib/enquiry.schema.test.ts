import { describe, expect, it } from "vitest";

import { enquirySchema } from "./enquiry.schema";

const validContact = {
    category: "contact" as const,
    client_name: "Test Visitor",
    email: "visitor@example.com",
    notes: "I would like to learn more.",
    consent: true as const,
};

describe("enquirySchema", () => {
    it("accepts a valid contact enquiry", () => {
        expect(enquirySchema.safeParse(validContact).success).toBe(true);
    });

    it("rejects invalid required fields, email, phone and consent", () => {
        for (const invalid of [
            { ...validContact, client_name: " " },
            { ...validContact, email: "not-an-email" },
            { ...validContact, phone: "abc-123" },
            { ...validContact, consent: false },
            { ...validContact, notes: " " },
        ]) {
            expect(enquirySchema.safeParse(invalid).success).toBe(false);
        }
    });

    it("accepts a valid phone number and a future date range", () => {
        expect(
            enquirySchema.safeParse({
                ...validContact,
                phone: "+254 712 345 678",
                arrival_date: "2099-06-01",
                departure_date: "2099-06-10",
            }).success,
        ).toBe(true);
    });

    it("rejects invalid calendar dates and a departure before arrival", () => {
        for (const dates of [
            { arrival_date: "2099-02-30", departure_date: "2099-03-02" },
            { arrival_date: "2099-06-10", departure_date: "2099-06-01" },
        ]) {
            expect(
                enquirySchema.safeParse({ ...validContact, ...dates }).success,
            ).toBe(false);
        }
    });

    it("requires a selected service and at least one adult for trip planning", () => {
        const planner = {
            ...validContact,
            category: "trip_planner" as const,
            services: [],
            adults: 0,
        };

        expect(enquirySchema.safeParse(planner).success).toBe(false);
        expect(
            enquirySchema.safeParse({
                ...planner,
                services: ["Bespoke holiday"],
                adults: 2,
            }).success,
        ).toBe(true);
    });
});
