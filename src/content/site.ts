export const SITE = {
    name: "AIMILLE VOYAGES",
    descriptor: "Bespoke Travel & Concierge Services",
    tagline: "Explore. Experience. Travel Better.",
    supporting: "From Kenya to the world, and the world to Kenya.",
    whatsappDisplay: "+254 112 414 190",
    whatsappNumber: "254112414190",
    email: "aimillevoyages@gmail.com",
    instagram: "https://www.instagram.com/aimillevoyages/",
    tiktok: "https://www.tiktok.com/@aimillevoyages",
    handle: "@aimillevoyages",
};

export function whatsappUrl(message?: string) {
    const base = `https://wa.me/${SITE.whatsappNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const waMsg = (topic: string) =>
    `Hello AIMILLE VOYAGES, I would like to enquire about ${topic}.`;

export const NAV = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/services", label: "Services" },
    { to: "/destinations", label: "Destinations" },
    { to: "/experiences", label: "Experiences" },
    { to: "/long-stay", label: "Long-Stay Concierge" },
    { to: "/contact", label: "Contact" },
] as const;

export const SUPPLIER_NOTE =
    "All accommodation, transport, excursions and other supplier services are subject to availability, supplier confirmation and applicable terms. Submitting an enquiry does not confirm a booking.";
