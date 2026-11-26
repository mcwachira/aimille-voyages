import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { listCustomers, listEnquiries } from "./queries";

vi.mock("@/integrations/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

function createQueryClient(rows: Record<string, unknown[]>, failTable?: string) {
    const from = vi.fn((table: string) => {
        let matches = rows[table] ?? [];
        const failed = failTable === table;
        const query = {
            select: vi.fn(() => query),
            order: vi.fn(() => query),
            eq: vi.fn((column: string, value: unknown) => {
                matches = matches.filter((row) => (row as Record<string, unknown>)[column] === value);
                return query;
            }),
            or: vi.fn((expression: string) => {
                const filters = expression.split(",").map((part) => {
                    const separator = ".ilike.%";
                    const index = part.indexOf(separator);
                    return [part.slice(0, index), part.slice(index + separator.length, -1).toLowerCase()];
                });
                matches = matches.filter((row) => filters.some(([column, term]) => String((row as Record<string, unknown>)[column] ?? "").toLowerCase().includes(term)));
                return query;
            }),
            range: vi.fn(async (start: number, end: number) => ({ data: failed ? null : matches.slice(start, end + 1), count: matches.length, error: failed ? new Error("RLS denied") : null })),
            limit: vi.fn(async (limit: number) => ({ data: failed ? null : matches.slice(0, limit), count: matches.length, error: failed ? new Error("RLS denied") : null })),
        };
        return query;
    });
    return { from };
}

describe("dashboard operational read queries", () => {
    beforeEach(() => vi.clearAllMocks());

    it("filters enquiries using their existing stored fields", async () => {
        vi.mocked(createSupabaseServerClient).mockResolvedValue(createQueryClient({
            enquiries: [
                { id: "1", client_name: "Amina Noor", email: "amina@example.test", destination: "Mombasa", category: "holiday", status: "new" },
                { id: "2", client_name: "Sam Otieno", email: "sam@example.test", destination: "Nairobi", category: "corporate", status: "contacted" },
            ] as never,
        }) as never);

        const result = await listEnquiries({ query: "mombasa", status: "new" });
        expect(result.error).toBeNull();
        expect(result.data?.items.map((record) => record.id)).toEqual(["1"]);
    });

    it("filters the customer directory by name and returns an empty list when unmatched", async () => {
        vi.mocked(createSupabaseServerClient).mockResolvedValue(createQueryClient({
            customers: [{ id: "1", full_name: "Amina Noor", email: "amina@example.test", phone: null, country: "Kenya" }],
        }) as never);

        const result = await listCustomers({ query: "unknown" });
        expect(result).toEqual({ data: { items: [], total: 0, page: 1, totalPages: 1, pageSize: 50 }, error: null });
    });

    it("fails closed when the authenticated query is denied", async () => {
        vi.mocked(createSupabaseServerClient).mockResolvedValue(createQueryClient({}, "customers") as never);

        await expect(listCustomers()).resolves.toEqual({ data: null, error: "unavailable" });
    });

    it("uses database ranges and returns exact filtered pagination totals", async () => {
        const customers = Array.from({ length: 73 }, (_, index) => ({
            id: String(index + 1), full_name: `Customer ${index + 1}`, email: "guest@example.test", phone: null, country: "Kenya",
        }));
        const client = createQueryClient({ customers });
        vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);

        const result = await listCustomers({ page: 2 });
        expect(result.data).toMatchObject({ page: 2, total: 73, totalPages: 2, pageSize: 50 });
        expect(result.data?.items).toHaveLength(23);
        expect(client.from).toHaveBeenCalledWith("customers");
    });
});
