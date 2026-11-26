import { createSupabaseServerClient } from "@/integrations/supabase/server";
import type { Tables } from "@/integrations/supabase/types";

export const OPERATIONS_PAGE_SIZE = 50;
const MAX_PAGE = 10_000;
const RELATED_LIMIT = 100;

export type Enquiry = Tables<"enquiries">;
export type Booking = Tables<"bookings">;
export type BookingWithRelatedRecords = Booking & {
    customers: Pick<Customer, "id" | "full_name" | "email" | "phone"> | null;
    enquiries: Pick<Enquiry, "id" | "client_name" | "email" | "category" | "destination"> | null;
};
export type Customer = Tables<"customers">;
export type InternalNote = Tables<"internal_notes">;
export type Conversation = Tables<"conversations">;

export type QueryResult<T> =
    | { data: T; error: null }
    | { data: null; error: "unavailable" };

export type RecordFilter = { query?: string; status?: string; page?: number };
export type PagedRecords<T> = {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    pageSize: number;
};

function safeSearchTerm(query: string | undefined) {
    return query?.trim().replace(/[^\p{L}\p{N}\s@._+-]/gu, "").trim() ?? "";
}

function buildOrSearch(term: string, columns: string[]) {
    return columns.map((column) => `${column}.ilike.%${term}%`).join(",");
}

function normalizePage(page: number | undefined) {
    return Number.isInteger(page) && page! > 0 ? Math.min(page!, MAX_PAGE) : 1;
}

export async function listEnquiries(filter: RecordFilter = {}): Promise<QueryResult<PagedRecords<Enquiry>>> {
    const supabase = await createSupabaseServerClient();
    const term = safeSearchTerm(filter.query);
    const requestedPage = normalizePage(filter.page);
    const createQuery = () => {
        let query = supabase.from("enquiries").select("*", { count: "exact" }).order("created_at", { ascending: false });
        if (filter.status) query = query.eq("status", filter.status);
        if (term) query = query.or(buildOrSearch(term, ["client_name", "email", "destination", "category"]));
        return query;
    };
    const firstResult = await createQuery().range((requestedPage - 1) * OPERATIONS_PAGE_SIZE, requestedPage * OPERATIONS_PAGE_SIZE - 1);
    let data = firstResult.data;
    const { count, error } = firstResult;
    if (error || !data) return { data: null, error: "unavailable" };
    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / OPERATIONS_PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    if (page !== requestedPage) {
        const result = await createQuery().range((page - 1) * OPERATIONS_PAGE_SIZE, page * OPERATIONS_PAGE_SIZE - 1);
        if (result.error || !result.data) return { data: null, error: "unavailable" };
        data = result.data;
    }
    return { data: { items: data, total, page, totalPages, pageSize: OPERATIONS_PAGE_SIZE }, error: null };
}

export async function getEnquiry(id: string): Promise<QueryResult<Enquiry | null>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("enquiries").select("*").eq("id", id).maybeSingle();
    if (error) return { data: null, error: "unavailable" };
    return { data, error: null };
}

export async function listEnquiryStatuses(): Promise<QueryResult<string[]>> {
    const supabase = await createSupabaseServerClient();
    const statuses = new Set<string>();
    for (let page = 0; page < 100; page += 1) {
        const { data, error } = await supabase.from("enquiries").select("status").range(page * 500, page * 500 + 499);
        if (error || !data) return { data: null, error: "unavailable" };
        data.forEach((row) => { if (row.status) statuses.add(row.status); });
        if (data.length < 500) break;
    }
    return { data: [...statuses].sort(), error: null };
}

export async function listBookings(filter: RecordFilter = {}): Promise<QueryResult<PagedRecords<Booking>>> {
    const supabase = await createSupabaseServerClient();
    const term = safeSearchTerm(filter.query);
    const requestedPage = normalizePage(filter.page);
    const createQuery = () => {
        let query = supabase.from("bookings").select("*", { count: "exact" }).order("created_at", { ascending: false });
        if (filter.status) query = query.eq("status", filter.status);
        if (term) query = query.or(buildOrSearch(term, ["booking_reference", "destination", "service_category"]));
        return query;
    };
    const firstResult = await createQuery().range((requestedPage - 1) * OPERATIONS_PAGE_SIZE, requestedPage * OPERATIONS_PAGE_SIZE - 1);
    let data = firstResult.data;
    const { count, error } = firstResult;
    if (error || !data) return { data: null, error: "unavailable" };
    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / OPERATIONS_PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    if (page !== requestedPage) {
        const result = await createQuery().range((page - 1) * OPERATIONS_PAGE_SIZE, page * OPERATIONS_PAGE_SIZE - 1);
        if (result.error || !result.data) return { data: null, error: "unavailable" };
        data = result.data;
    }
    return { data: { items: data, total, page, totalPages, pageSize: OPERATIONS_PAGE_SIZE }, error: null };
}

export async function getBooking(id: string): Promise<QueryResult<BookingWithRelatedRecords | null>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("bookings")
        .select("*, customers(id, full_name, email, phone), enquiries(id, client_name, email, category, destination)")
        .eq("id", id)
        .maybeSingle();
    if (error) return { data: null, error: "unavailable" };
    return { data, error: null };
}

export async function listBookingStatuses(): Promise<QueryResult<string[]>> {
    const supabase = await createSupabaseServerClient();
    const statuses = new Set<string>();
    for (let page = 0; page < 100; page += 1) {
        const { data, error } = await supabase.from("bookings").select("status").range(page * 500, page * 500 + 499);
        if (error || !data) return { data: null, error: "unavailable" };
        data.forEach((row) => { if (row.status) statuses.add(row.status); });
        if (data.length < 500) break;
    }
    return { data: [...statuses].sort(), error: null };
}

export async function listEnquiryBookings(enquiryId: string): Promise<QueryResult<Booking[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("enquiry_id", enquiryId)
        .order("created_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}

export async function listCustomers(filter: RecordFilter = {}): Promise<QueryResult<PagedRecords<Customer>>> {
    const supabase = await createSupabaseServerClient();
    const term = safeSearchTerm(filter.query);
    const requestedPage = normalizePage(filter.page);
    const createQuery = () => {
        let query = supabase.from("customers").select("*", { count: "exact" }).order("updated_at", { ascending: false });
        if (term) query = query.or(buildOrSearch(term, ["full_name", "email", "phone", "country"]));
        return query;
    };
    const firstResult = await createQuery().range((requestedPage - 1) * OPERATIONS_PAGE_SIZE, requestedPage * OPERATIONS_PAGE_SIZE - 1);
    let data = firstResult.data;
    const { count, error } = firstResult;
    if (error || !data) return { data: null, error: "unavailable" };
    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / OPERATIONS_PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    if (page !== requestedPage) {
        const result = await createQuery().range((page - 1) * OPERATIONS_PAGE_SIZE, page * OPERATIONS_PAGE_SIZE - 1);
        if (result.error || !result.data) return { data: null, error: "unavailable" };
        data = result.data;
    }
    return { data: { items: data, total, page, totalPages, pageSize: OPERATIONS_PAGE_SIZE }, error: null };
}

export async function getCustomer(id: string): Promise<QueryResult<Customer | null>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
    if (error) return { data: null, error: "unavailable" };
    return { data, error: null };
}

export async function listCustomerEnquiries(customerId: string): Promise<QueryResult<Enquiry[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}

export async function listCustomerBookings(customerId: string): Promise<QueryResult<Booking[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}

export async function listEnquiryNotes(enquiryId: string): Promise<QueryResult<InternalNote[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("internal_notes")
        .select("*")
        .eq("enquiry_id", enquiryId)
        .order("created_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}

export async function listBookingNotes(bookingId: string): Promise<QueryResult<InternalNote[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("internal_notes")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}

export async function listCustomerNotes(customerId: string): Promise<QueryResult<InternalNote[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("internal_notes")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}

export async function listCustomerConversations(customerId: string): Promise<QueryResult<Conversation[]>> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("customer_id", customerId)
        .order("last_message_at", { ascending: false })
        .limit(RELATED_LIMIT);
    return error || !data ? { data: null, error: "unavailable" } : { data, error: null };
}
