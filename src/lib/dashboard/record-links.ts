const RECORD_ROUTES: Record<string, { path: string; label: string }> = {
    enquiry: { path: "enquiries", label: "enquiry" },
    enquiries: { path: "enquiries", label: "enquiry" },
    booking: { path: "bookings", label: "booking" },
    bookings: { path: "bookings", label: "booking" },
    customer: { path: "customers", label: "customer" },
    customers: { path: "customers", label: "customer" },
    conversation: { path: "messages", label: "conversation" },
    conversations: { path: "messages", label: "conversation" },
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getDashboardRecordLink(entityType: string | null, entityId: string | null) {
    if (!entityType || !entityId || !UUID_PATTERN.test(entityId)) return null;
    const key = entityType.trim().toLowerCase().replace(/[\s-]+/g, "_");
    const route = RECORD_ROUTES[key];
    if (!route) return null;
    return {
        href: `/dashboard/${route.path}/${encodeURIComponent(entityId)}`,
        label: route.label,
    };
}
