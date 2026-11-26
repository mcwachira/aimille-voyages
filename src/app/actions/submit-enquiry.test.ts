import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    headers: vi.fn(),
    limitEnquirySubmission: vi.fn(),
    from: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/rate-limit", () => ({ limitEnquirySubmission: mocks.limitEnquirySubmission }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { from: mocks.from } }));

import { submitEnquiry } from "./submit-enquiry";

const validEnquiry = {
    category: "contact",
    client_name: "Test Visitor",
    email: "visitor@example.test",
    notes: "Please tell me about your services.",
    consent: true,
};

function createAwaitableQuery(result: { data: unknown; error: unknown }) {
    const query: Record<string, unknown> & { then: (resolve: (value: unknown) => unknown, reject?: (error: unknown) => unknown) => Promise<unknown> } = {
        select: vi.fn(() => query),
        eq: vi.fn(() => query),
        gte: vi.fn(() => query),
        order: vi.fn(() => query),
        limit: vi.fn(() => query),
        is: vi.fn(() => query),
        then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    };
    return query;
}

describe("submitEnquiry", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.headers.mockResolvedValue(new Headers({ "x-forwarded-for": "203.0.113.10" }));
        mocks.limitEnquirySubmission.mockResolvedValue({ success: true });
    });

    it("rejects invalid input before invoking rate limiting or Supabase", async () => {
        await expect(submitEnquiry({ ...validEnquiry, email: "invalid" })).rejects.toThrow();

        expect(mocks.limitEnquirySubmission).not.toHaveBeenCalled();
        expect(mocks.from).not.toHaveBeenCalled();
    });

    it("rejects a filled honeypot without accessing Supabase", async () => {
        await expect(submitEnquiry({ ...validEnquiry, website: "automated submission" })).rejects.toThrow();

        expect(mocks.limitEnquirySubmission).not.toHaveBeenCalled();
        expect(mocks.from).not.toHaveBeenCalled();
    });

    it("stops before database access when the rate limiter rejects a submission", async () => {
        mocks.limitEnquirySubmission.mockResolvedValue({ success: false });

        await expect(submitEnquiry(validEnquiry)).rejects.toThrow("Too many enquiries");

        expect(mocks.limitEnquirySubmission).toHaveBeenCalledWith("203.0.113.10");
        expect(mocks.from).not.toHaveBeenCalled();
    });

    it("returns a recent duplicate without inserting a second enquiry", async () => {
        const duplicateQuery = createAwaitableQuery({ data: [{ id: "existing-id" }], error: null });
        mocks.from.mockReturnValue(duplicateQuery);

        await expect(submitEnquiry(validEnquiry)).resolves.toEqual({ id: "existing-id", duplicate: true });

        expect(mocks.from).toHaveBeenCalledTimes(1);
        expect(duplicateQuery.eq).toHaveBeenCalledWith("email", "visitor@example.test");
    });

    it("stores validated fields without consent or honeypot values", async () => {
        const duplicateQuery = createAwaitableQuery({ data: [], error: null });
        const insert = vi.fn();
        const single = vi.fn().mockResolvedValue({ data: { id: "saved-id" }, error: null });
        const insertQuery = {
            insert: (row: Record<string, unknown>) => { insert(row); return insertQuery; },
            select: vi.fn(() => insertQuery),
            single,
        };
        mocks.from.mockReturnValueOnce(duplicateQuery).mockReturnValueOnce(insertQuery);

        await expect(submitEnquiry(validEnquiry)).resolves.toEqual({ id: "saved-id", duplicate: false });

        expect(insert).toHaveBeenCalledOnce();
        const storedRow = insert.mock.calls[0][0] as Record<string, unknown>;
        expect(storedRow).toMatchObject({ client_name: "Test Visitor", email: "visitor@example.test" });
        expect(storedRow).not.toHaveProperty("consent");
        expect(storedRow).not.toHaveProperty("website");
    });
});
