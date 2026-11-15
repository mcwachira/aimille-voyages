import type { StaticImageData } from "next/image";
import holidays from "@/assets/private.jpg";
import stay from "@/assets/stay.jpg";
import transport from "@/assets/transport.jpg";
import experiences from "@/assets/culture.jpg";
import longstay from "@/assets/diani.jpg";
import corporate from "@/assets/corporate.jpg";
import type { EnquiryCategory } from "@/content/enquiry-forms";

export type Service = {
    slug: string;
    title: string;
    short: string;
    image: StaticImageData | string;
    intro: string;
    covers: string[];
    benefits: string[];
    cta: string;
    form: EnquiryCategory;
    whatsapp: string;
};

export const SERVICES: Service[] = [
    {
        slug: "bespoke-holidays",
        title: "Bespoke Holidays",
        short: "Personalised holidays, romantic escapes, family getaways and tailor-made travel experiences.",
        image: holidays,
        intro:
            "Every holiday we plan starts with a conversation about you — how you like to travel, what you want to feel, and what matters most. From there we shape an itinerary around your pace.",
        covers: [
            "Tailor-made holidays",
            "Honeymoons and romantic getaways",
            "Family holidays",
            "Safari holidays",
            "Beach escapes",
            "Multi-destination itineraries",
            "Weekend getaways",
            "Private travel arrangements",
        ],
        benefits: ["Itineraries built around your interests", "One point of contact throughout", "Considered recommendations, not packages"],
        cta: "Plan your holiday",
        form: "holiday",
        whatsapp: "a bespoke holiday in Kenya",
    },
    {
        slug: "accommodation",
        title: "Accommodation & Stays",
        short: "Hotel recommendations, accommodation arrangements, serviced apartments, private stays and long-term rentals.",
        image: stay,
        intro:
            "Where you stay shapes how you experience a place. We recommend and coordinate accommodation that suits your plans, from a few nights to several months.",
        covers: [
            "Hotels",
            "Boutique accommodation",
            "Serviced apartments",
            "Private stays",
            "Vacation rentals",
            "Long-stay accommodation",
            "Accommodation recommendations and coordination",
        ],
        benefits: ["Options matched to your location and needs", "Support for short and long stays", "Coordination with your wider plans"],
        cta: "Find your stay",
        form: "accommodation",
        whatsapp: "accommodation in Kenya",
    },
    {
        slug: "transport",
        title: "Transport & Transfers",
        short: "Airport pickups, private transfers, chauffeur services, car hire and domestic travel coordination.",
        image: transport,
        intro:
            "Smooth movement makes a journey feel effortless. We coordinate transport from the moment you land until you depart.",
        covers: [
            "Airport transfers",
            "Chauffeur services",
            "Private transportation",
            "Car hire coordination",
            "Domestic transfers",
            "Intercity travel arrangements",
            "Group transportation",
        ],
        benefits: ["Arrival and departure handled", "Vehicles suited to your group", "Domestic flights and road travel coordinated"],
        cta: "Arrange your transport",
        form: "transport",
        whatsapp: "airport transfers and transport in Kenya",
    },
    {
        slug: "experiences-lifestyle",
        title: "Experiences & Lifestyle",
        short: "Curated excursions, cultural experiences, dining, adventure, private experiences and lifestyle assistance.",
        image: experiences,
        intro:
            "Beyond the itinerary, we help you find the moments that make a trip yours — a table worth booking, a guide worth meeting, a morning worth waking early for.",
        covers: [
            "Private excursions",
            "Cultural experiences",
            "Food and dining recommendations",
            "Restaurant arrangements",
            "Guided experiences",
            "Adventure activities",
            "Beach activities",
            "Special occasions",
            "Personalised lifestyle assistance",
        ],
        benefits: ["Curated to your interests", "Local knowledge", "Help with special occasions"],
        cta: "Discover experiences",
        form: "experiences",
        whatsapp: "curated experiences in Kenya",
    },
    {
        slug: "long-stay",
        title: "Long-Stay & Relocation",
        short: "Personalised support for visitors spending 30, 60 or 90 days or longer in Kenya.",
        image: longstay,
        intro:
            "Extended stays require more than a hotel reservation. We help coordinate the practical details that make living in Kenya more comfortable.",
        covers: [
            "Accommodation sourcing and coordination",
            "Serviced apartment arrangements",
            "Airport arrival assistance",
            "Private transportation",
            "Local orientation",
            "Grocery and essential shopping coordination",
            "Dining and lifestyle recommendations",
            "Family and individual stay support",
            "Excursion planning during extended stays",
            "Ongoing concierge assistance",
        ],
        benefits: ["Feel settled from day one", "Ongoing support during your stay", "Help for individuals and families"],
        cta: "Plan your long stay",
        form: "long_stay",
        whatsapp: "your long-stay concierge services in Kenya",
    },
    {
        slug: "corporate-group",
        title: "Corporate & Group Travel",
        short: "Travel coordination, accommodation, transportation and experience planning for businesses, teams and groups.",
        image: corporate,
        intro:
            "Group and business travel needs clear coordination. We help organise accommodation, movement and experiences so your team can focus on why they came.",
        covers: [
            "Corporate accommodation arrangements",
            "Executive transportation",
            "Business travel coordination",
            "Conference and event travel support",
            "Group accommodation coordination",
            "Group excursions",
            "Team retreats",
            "Incentive travel",
            "Multi-person itinerary coordination",
        ],
        benefits: ["One coordinator for the whole group", "Flexible arrangements", "Support during the trip"],
        cta: "Discuss corporate travel",
        form: "corporate",
        whatsapp: "corporate and group travel in Kenya",
    },
];

export function getService(slug: string): Service | undefined {
    return SERVICES.find((service) => service.slug === slug);
}

export function serviceHref(service: Service): string {
    return service.slug === "long-stay"
        ? "/long-stay"
        : `/services/${service.slug}`;
}