import type { StaticImageData } from "next/image";
import nairobi from "@/assets/nairobi.jpg";
import mara from "@/assets/hero-mara.jpg";
import amboseli from "@/assets/amboseli.jpg";
import tsavo from "@/assets/tsavo.jpg";
import diani from "@/assets/diani.jpg";
import watamu from "@/assets/watamu.jpg";
import mombasa from "@/assets/mombasa.jpg";

export type Destination = {
    slug: string;
    name: string;
    country: string;
    region: string;
    image: StaticImageData | string;
    summary: string;
    intro: string;
    special: string[];
    experiences: string[];
    accommodation: string;
    transport: string;
    stayLength: string;
    related: string[];
};

// Structured content: add a new entry here (any country) and it appears
// across the site, including its own page and the sitemap.
export const DESTINATIONS: Destination[] = [
    {
        slug: "nairobi",
        name: "Nairobi",
        country: "Kenya",
        region: "Central Kenya",
        image: nairobi,
        summary:
            "The dynamic heart of Kenya, combining modern city life, culture, dining and distinctive urban experiences.",
        intro:
            "Nairobi is where most journeys in Kenya begin — a lively capital with a national park on its doorstep, a growing food scene, galleries, markets and leafy neighbourhoods that make it an easy base for short visits and extended stays alike.",
        special: [
            "A national park with wildlife against a city skyline",
            "Creative galleries, craft markets and design studios",
            "A diverse and evolving restaurant scene",
            "Convenient gateway to the rest of the country",
        ],
        experiences: ["City and cultural orientation", "Nairobi National Park game drive", "Food and market discovery", "Art and craft visits"],
        accommodation:
            "Options range from city hotels to serviced apartments in quieter residential areas — well suited to longer stays and families.",
        transport:
            "Traffic can be heavy at peak hours, so private transfers and a planned daily rhythm make a real difference.",
        stayLength: "2–4 days for a visit; Nairobi also works well as a long-stay base.",
        related: ["maasai-mara", "amboseli"],
    },
    {
        slug: "maasai-mara",
        name: "Maasai Mara",
        country: "Kenya",
        region: "South-West Kenya",
        image: mara,
        summary: "Discover extraordinary wildlife, expansive savannahs and iconic safari landscapes.",
        intro:
            "The Maasai Mara is Kenya's most celebrated safari destination: rolling golden plains, acacia-dotted horizons and some of the richest wildlife viewing on the continent, together with the surrounding conservancies.",
        special: [
            "Exceptional year-round wildlife viewing",
            "Seasonal wildebeest migration, typically in the drier months",
            "Private conservancies offering a quieter experience",
            "Maasai culture and community",
        ],
        experiences: ["Game drives", "Sunrise balloon flights", "Guided bush walks in conservancies", "Cultural visits"],
        accommodation:
            "Choices include tented camps and lodges inside the reserve or in neighbouring conservancies; we help match style, location and budget.",
        transport:
            "Reach the Mara by scheduled light aircraft from Nairobi or by road. Flights save time; road journeys suit some itineraries and budgets.",
        stayLength: "3–4 nights is a comfortable minimum.",
        related: ["amboseli", "nairobi"],
    },
    {
        slug: "amboseli",
        name: "Amboseli",
        country: "Kenya",
        region: "Southern Kenya",
        image: amboseli,
        summary: "Experience remarkable wildlife encounters against the backdrop of Mount Kilimanjaro.",
        intro:
            "Amboseli is known for its large elephant herds and wide open plains framed by Mount Kilimanjaro across the border — on clear mornings, one of Africa's most memorable views.",
        special: [
            "Elephants against the silhouette of Kilimanjaro",
            "Open terrain, good for photography",
            "Wetlands that attract birdlife",
            "Accessible by road or air from Nairobi",
        ],
        experiences: ["Early morning game drives", "Photography-focused safaris", "Community visits"],
        accommodation: "Lodges and tented camps inside and around the park, with views of the mountain from many.",
        transport: "Around four to five hours by road from Nairobi, or a short scheduled flight.",
        stayLength: "2–3 nights.",
        related: ["tsavo", "maasai-mara"],
    },
    {
        slug: "tsavo",
        name: "Tsavo",
        country: "Kenya",
        region: "South-East Kenya",
        image: tsavo,
        summary: "Explore vast wilderness, distinctive landscapes and unforgettable safari experiences.",
        intro:
            "Tsavo East and Tsavo West together form one of the largest protected areas in Kenya — red earth, volcanic hills, springs and a sense of genuine wilderness that pairs naturally with time on the coast.",
        special: [
            "Red-dusted elephants and wide horizons",
            "Volcanic landscapes and natural springs in Tsavo West",
            "Fewer vehicles and a sense of space",
            "Easy combination with Diani, Watamu or Mombasa",
        ],
        experiences: ["Game drives", "Safari-and-beach combinations", "Scenic landscape excursions"],
        accommodation: "Lodges and camps spread across a vast area — location matters for drive times.",
        transport: "Reachable by road from Mombasa or Nairobi, or by rail to stations near the parks.",
        stayLength: "2–3 nights, often combined with the coast.",
        related: ["diani-beach", "mombasa"],
    },
    {
        slug: "diani-beach",
        name: "Diani Beach",
        country: "Kenya",
        region: "South Coast",
        image: diani,
        summary: "Discover white-sand beaches, turquoise waters and relaxed coastal living.",
        intro:
            "Diani is a long stretch of white sand on Kenya's south coast, with warm water, coral reef, and a relaxed pace that suits honeymoons, families and longer coastal stays.",
        special: [
            "Long, palm-fringed white-sand beach",
            "Reef, snorkelling and dhow trips",
            "Relaxed coastal lifestyle",
            "Popular with long-stay visitors",
        ],
        experiences: ["Dhow sailing", "Snorkelling", "Beach dining", "Wellness and relaxation"],
        accommodation: "Beach hotels, boutique properties, private villas and longer-term rentals.",
        transport: "Domestic flights to the south coast or road transfers from Mombasa.",
        stayLength: "4–7 nights; many guests stay much longer.",
        related: ["watamu", "mombasa"],
    },
    {
        slug: "watamu",
        name: "Watamu",
        country: "Kenya",
        region: "North Coast",
        image: watamu,
        summary: "Experience beautiful beaches, marine life and the charm of Kenya's coastline.",
        intro:
            "Watamu is a smaller, quieter coastal village known for its lagoons, coral rock islets and protected marine environment — ideal for slow travel and nature lovers.",
        special: [
            "Marine conservation area and coral gardens",
            "Tidal lagoons and sandbanks",
            "Nearby forest and historic ruins",
            "A quieter village atmosphere",
        ],
        experiences: ["Snorkelling and marine excursions", "Forest walks", "Coastal heritage visits"],
        accommodation: "Boutique hotels, beach houses and private villas.",
        transport: "Domestic flights to nearby Malindi, then a short road transfer.",
        stayLength: "4–7 nights.",
        related: ["diani-beach", "mombasa"],
    },
    {
        slug: "mombasa",
        name: "Mombasa",
        country: "Kenya",
        region: "Coast",
        image: mombasa,
        summary:
            "Explore coastal heritage, Swahili culture, historic architecture and vibrant local experiences.",
        intro:
            "Mombasa is Kenya's historic port city — carved doors, narrow lanes of the Old Town, Swahili cuisine and centuries of Indian Ocean trade — and the gateway to the coast.",
        special: [
            "Historic Old Town and fort",
            "Swahili food and culture",
            "Gateway to north and south coast beaches",
            "Connection by rail and air to Nairobi",
        ],
        experiences: ["Old Town heritage walks", "Swahili food experiences", "Harbour and dhow trips"],
        accommodation: "City and beach hotels north and south of the island.",
        transport: "Reachable by domestic flight, rail or road from Nairobi.",
        stayLength: "1–2 days, often combined with the beach.",
        related: ["diani-beach", "tsavo"],
    },
];

export function getDestination(
    slug: string
): Destination | undefined {
    return DESTINATIONS.find(
        (destination) => destination.slug === slug
    );
}