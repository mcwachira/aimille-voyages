export type EnquiryCategory =
    | "holiday"
    | "accommodation"
    | "transport"
    | "experiences"
    | "long_stay"
    | "corporate"
    | "contact";

export type FieldType = "text" | "email" | "tel" | "date" | "time" | "number" | "select" | "textarea";

export type Field = {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    /** maps to a top-level enquiry column instead of the details bag */
    column?:
        | "client_name"
        | "email"
        | "phone"
        | "country"
        | "company"
        | "destination"
        | "arrival_date"
        | "departure_date"
        | "adults"
        | "budget"
        | "preferences"
        | "notes";
    full?: boolean;
    /** for date fields: must be on/after this other field */
    after?: string;
};

const contact: Field[] = [
    { name: "client_name", label: "Full name", type: "text", required: true, column: "client_name" },
    { name: "email", label: "Email address", type: "email", required: true, column: "email" },
    { name: "phone", label: "WhatsApp or phone", type: "tel", column: "phone" },
    { name: "country", label: "Country of residence", type: "text", column: "country" },
];

const budget: Field = {
    name: "budget",
    label: "Estimated budget (optional)",
    type: "text",
    column: "budget",
    placeholder: "e.g. USD 5,000 or still exploring",
};

export const EnquiryForms: Record<EnquiryCategory, { title: string; fields: Field[] }> = {
    holiday: {
        title: "Holiday enquiry",
        fields: [
            ...contact,
            { name: "destination", label: "Destination", type: "text", column: "destination" },
            { name: "arrival_date", label: "Travel from", type: "date", column: "arrival_date" },
            { name: "departure_date", label: "Travel to", type: "date", column: "departure_date", after: "arrival_date" },
            { name: "adults", label: "Number of travellers", type: "number", column: "adults" },
            {
                name: "holiday_type",
                label: "Holiday type",
                type: "select",
                options: ["Safari", "Beach", "Honeymoon / romantic", "Family", "Multi-destination", "Weekend getaway", "Not sure yet"],
            },
            { name: "interests", label: "Interests", type: "text", column: "preferences" },
            budget,
            { name: "notes", label: "Additional requests", type: "textarea", column: "notes", full: true },
        ],
    },
    accommodation: {
        title: "Accommodation enquiry",
        fields: [
            ...contact,
            { name: "destination", label: "Preferred location", type: "text", column: "destination" },
            { name: "arrival_date", label: "Check-in", type: "date", column: "arrival_date" },
            { name: "departure_date", label: "Check-out", type: "date", column: "departure_date", after: "arrival_date" },
            { name: "adults", label: "Number of guests", type: "number", column: "adults" },
            {
                name: "accommodation_type",
                label: "Accommodation type",
                type: "select",
                options: ["Hotel", "Boutique", "Serviced apartment", "Private villa / house", "Lodge / camp", "Open to suggestions"],
            },
            { name: "bedrooms", label: "Bedrooms (if applicable)", type: "number" },
            { name: "stay_type", label: "Stay length", type: "select", options: ["Short stay", "Long stay (30+ days)"] },
            budget,
            { name: "notes", label: "Special requirements", type: "textarea", column: "notes", full: true },
        ],
    },
    transport: {
        title: "Transport enquiry",
        fields: [
            ...contact,
            { name: "pickup", label: "Pickup location", type: "text", required: true },
            { name: "dropoff", label: "Drop-off location", type: "text", required: true },
            { name: "arrival_date", label: "Date", type: "date", column: "arrival_date" },
            { name: "pickup_time", label: "Pickup time", type: "time" },
            { name: "adults", label: "Passengers", type: "number", column: "adults" },
            { name: "luggage", label: "Luggage requirements", type: "text" },
            { name: "vehicle", label: "Vehicle preference", type: "select", options: ["Saloon", "SUV", "Van / minibus", "Safari vehicle", "No preference"] },
            { name: "trip", label: "Journey", type: "select", options: ["One-way", "Return"] },
            { name: "notes", label: "Anything else", type: "textarea", column: "notes", full: true },
        ],
    },
    experiences: {
        title: "Experiences enquiry",
        fields: [
            ...contact,
            { name: "destination", label: "Destination", type: "text", column: "destination" },
            {
                name: "experience_category",
                label: "Experience category",
                type: "select",
                options: ["Wildlife & Safari", "Beaches & Coastal", "Culture & Heritage", "Food & Dining", "Adventure & Outdoors", "Wellness & Relaxation", "Private & Special Occasions"],
            },
            { name: "arrival_date", label: "Preferred date", type: "date", column: "arrival_date" },
            { name: "adults", label: "Participants", type: "number", column: "adults" },
            { name: "preferences", label: "Special preferences", type: "textarea", column: "preferences", full: true },
        ],
    },
    long_stay: {
        title: "Long-stay enquiry",
        fields: [
            ...contact,
            { name: "arrival_date", label: "Intended arrival", type: "date", column: "arrival_date" },
            { name: "departure_date", label: "Intended departure", type: "date", column: "departure_date", after: "arrival_date" },
            { name: "length", label: "Length of stay", type: "select", options: ["Around 30 days", "Around 60 days", "90 days or more", "Not sure yet"] },
            { name: "adults", label: "Number of occupants", type: "number", column: "adults" },
            { name: "accommodation", label: "Preferred accommodation", type: "select", options: ["Serviced apartment", "House / villa", "Hotel", "Open to suggestions"] },
            { name: "destination", label: "Preferred location", type: "text", column: "destination" },
            { name: "transport", label: "Transportation needs", type: "text" },
            { name: "family", label: "Family requirements", type: "text" },
            { name: "lifestyle", label: "Lifestyle assistance requirements", type: "text" },
            budget,
            { name: "notes", label: "Additional requests", type: "textarea", column: "notes", full: true },
        ],
    },
    corporate: {
        title: "Corporate & group enquiry",
        fields: [
            { name: "company", label: "Company or organisation", type: "text", required: true, column: "company" },
            { name: "client_name", label: "Contact person", type: "text", required: true, column: "client_name" },
            { name: "email", label: "Email", type: "email", required: true, column: "email" },
            { name: "phone", label: "Phone", type: "tel", column: "phone" },
            { name: "destination", label: "Destination", type: "text", column: "destination" },
            { name: "arrival_date", label: "Travel from", type: "date", column: "arrival_date" },
            { name: "departure_date", label: "Travel to", type: "date", column: "departure_date", after: "arrival_date" },
            { name: "adults", label: "Group size", type: "number", column: "adults" },
            { name: "accommodation", label: "Accommodation requirements", type: "text" },
            { name: "transport", label: "Transport requirements", type: "text" },
            { name: "events", label: "Event or activity requirements", type: "text" },
            { name: "notes", label: "Additional information", type: "textarea", column: "notes", full: true },
        ],
    },
    contact: {
        title: "Send us a message",
        fields: [
            ...contact,
            { name: "notes", label: "How can we help?", type: "textarea", required: true, column: "notes", full: true },
        ],
    },
};
