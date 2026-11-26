import { describe, expect, it } from "vitest";

import { getDashboardRecordLink } from "./record-links";

describe("getDashboardRecordLink", () => {
    const id = "8db02441-1bcf-4d5c-9795-343d508cdd44";

    it.each([
        ["enquiry", `/dashboard/enquiries/${id}`, "enquiry"],
        ["booking", `/dashboard/bookings/${id}`, "booking"],
        ["customer", `/dashboard/customers/${id}`, "customer"],
        ["conversation", `/dashboard/messages/${id}`, "conversation"],
    ])("maps the %s entity to its existing detail route", (entityType, href, label) => {
        expect(getDashboardRecordLink(entityType, id)).toEqual({ href, label });
    });

    it("accepts plural and case-varied operational entity names", () => {
        expect(getDashboardRecordLink("Bookings", id)).toEqual({
            href: `/dashboard/bookings/${id}`,
            label: "booking",
        });
    });

    it("does not create a link for unknown types or invalid identifiers", () => {
        expect(getDashboardRecordLink("unknown", id)).toBeNull();
        expect(getDashboardRecordLink("booking", "not-a-uuid")).toBeNull();
        expect(getDashboardRecordLink(null, id)).toBeNull();
    });
});
