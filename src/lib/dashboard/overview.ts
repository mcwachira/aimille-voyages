import "server-only";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

export async function getDashboardOverview() {
    const supabase = await createSupabaseServerClient();
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [enquiries, newEnquiries, bookings, customers, upcomingBookings, recentEnquiries, recentBookings, activity] = await Promise.all([
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("archived", false),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("archived", false).gte("arrival_date", new Date().toISOString().slice(0, 10)),
        supabase.from("enquiries").select("id,client_name,category,status,created_at,destination").order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("id,booking_reference,status,destination,arrival_date,departure_date,customer_id").eq("archived", false).order("created_at", { ascending: false }).limit(5),
        supabase.from("activity_logs").select("id,action,entity_type,summary,created_at,user_id").order("created_at", { ascending: false }).limit(5),
    ]);

    return {
        metrics: {
            enquiries: enquiries.error ? null : enquiries.count,
            newEnquiries: newEnquiries.error ? null : newEnquiries.count,
            bookings: bookings.error ? null : bookings.count,
            customers: customers.error ? null : customers.count,
            upcomingBookings: upcomingBookings.error ? null : upcomingBookings.count,
        },
        errors: {
            enquiries: Boolean(enquiries.error || recentEnquiries.error),
            bookings: Boolean(bookings.error || upcomingBookings.error || recentBookings.error),
            customers: Boolean(customers.error),
            activity: Boolean(activity.error),
        },
        recentEnquiries: recentEnquiries.error ? [] : recentEnquiries.data,
        recentBookings: recentBookings.error ? [] : recentBookings.data,
        activity: activity.error ? [] : activity.data,
    };
}

export function formatDashboardDate(value: string | null) {
    if (!value) return "Date not set";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date not set";
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}
