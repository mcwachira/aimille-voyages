import type { StaticImageData } from "next/image";
import mara from "@/assets/hero-mara.jpg";
import amboseli from "@/assets/amboseli.jpg";
import diani from "@/assets/diani.jpg";
import watamu from "@/assets/watamu.jpg";
import mombasa from "@/assets/mombasa.jpg";
import culture from "@/assets/culture.jpg";
import dining from "@/assets/dining.jpg";
import adventure from "@/assets/adventure.jpg";
import wellness from "@/assets/wellness.jpg";
import privateImg from "@/assets/private.jpg";
import nairobi from "@/assets/nairobi.jpg";

export type ExperienceCategory = {
    slug: string;
    name: string;
    image: StaticImageData | string;
    blurb: string;
};
export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
    { slug: "wildlife-safari", name: "Wildlife & Safari", image: amboseli, blurb: "Savannahs, game drives and unforgettable encounters." },
    { slug: "beaches-coastal", name: "Beaches & Coastal Escapes", image: diani, blurb: "White sand, warm water and slow coastal days." },
    { slug: "culture-heritage", name: "Culture & Heritage", image: culture, blurb: "Communities, crafts and centuries of history." },
    { slug: "food-dining", name: "Food & Dining", image: dining, blurb: "Swahili flavours, markets and memorable tables." },
    { slug: "adventure-outdoors", name: "Adventure & Outdoors", image: adventure, blurb: "Balloon flights, walks and wide open spaces." },
    { slug: "wellness-relaxation", name: "Wellness & Relaxation", image: wellness, blurb: "Unhurried time to rest and restore." },
    { slug: "private-occasions", name: "Private & Special Occasions", image: privateImg, blurb: "Celebrations, proposals and private moments." },
];

export type Experience = {
    slug: string;
    title: string;
    category: string;
    destination: string;
    image: StaticImageData | string;
    description: string;
    considerations: string[];
    duration?: string;
    durationVerified?: boolean;
};

/** Returns the duration only when it has been provided and verified. */
export function verifiedDuration(e: Pick<Experience, "duration" | "durationVerified">): string | undefined {
    const d = e.duration?.trim();
    return d && e.durationVerified ? d : undefined;
}

// Durations are intentionally omitted until verified with the business.
export const EXPERIENCES: Experience[] = [
    {
        slug: "maasai-mara-game-drives",
        title: "Game Drives in the Maasai Mara",
        category: "wildlife-safari",
        destination: "maasai-mara",
        image: mara,
        description: "Early mornings and golden afternoons on the plains with experienced guides, in search of the Mara's remarkable wildlife.",
        considerations: ["Wildlife sightings are never guaranteed", "Park and conservancy fees apply", "Subject to supplier availability"],
    },
    {
        slug: "amboseli-kilimanjaro-safari",
        title: "Elephants Beneath Kilimanjaro",
        category: "wildlife-safari",
        destination: "amboseli",
        image: amboseli,
        description: "Watch Amboseli's elephant families cross the open plains with Kilimanjaro rising behind them.",
        considerations: ["Mountain views depend on weather", "Best light is early morning"],
    },
    {
        slug: "diani-dhow-snorkelling",
        title: "Dhow Sailing & Snorkelling",
        category: "beaches-coastal",
        destination: "diani-beach",
        image: diani,
        description: "Sail a traditional dhow along the south coast and snorkel over the reef in clear, warm water.",
        considerations: ["Conditions depend on tides and weather", "Suitable swimming ability recommended"],
    },
    {
        slug: "watamu-marine-lagoons",
        title: "Watamu Lagoons & Marine Life",
        category: "beaches-coastal",
        destination: "watamu",
        image: watamu,
        description: "Explore sandbanks, coral islets and protected waters on Kenya's quieter north coast.",
        considerations: ["Tidal timing shapes the day", "Marine park rules apply"],
    },
    {
        slug: "mombasa-old-town-walk",
        title: "Mombasa Old Town Heritage Walk",
        category: "culture-heritage",
        destination: "mombasa",
        image: mombasa,
        description: "Wander narrow lanes of carved doors and coral-stone buildings and learn the story of the Swahili coast.",
        considerations: ["Modest dress is appreciated", "Comfortable walking shoes recommended"],
    },
    {
        slug: "beadwork-and-community",
        title: "Craft & Community Visits",
        category: "culture-heritage",
        destination: "maasai-mara",
        image: culture,
        description: "Meet local artisans and learn about traditional beadwork and the meaning behind its colours and patterns.",
        considerations: ["Visits are arranged respectfully with communities", "Photography only with permission"],
    },
    {
        slug: "swahili-coastal-dining",
        title: "Swahili Coastal Dining",
        category: "food-dining",
        destination: "mombasa",
        image: dining,
        description: "Discover the coast through its food — grilled fish, coconut curries, pilau and fresh tropical fruit.",
        considerations: ["Let us know about dietary requirements", "Restaurant arrangements subject to availability"],
    },
    {
        slug: "nairobi-food-and-markets",
        title: "Nairobi Food & Market Discovery",
        category: "food-dining",
        destination: "nairobi",
        image: nairobi,
        description: "From local favourites to contemporary kitchens, explore how Nairobi eats.",
        considerations: ["Recommendations tailored to your tastes"],
    },
    {
        slug: "mara-balloon-flight",
        title: "Sunrise Balloon Flight",
        category: "adventure-outdoors",
        destination: "maasai-mara",
        image: adventure,
        description: "Drift over the Mara at first light as mist lifts from the plains below.",
        considerations: ["Weather dependent", "Age and health restrictions may apply", "Subject to operator availability"],
    },
    {
        slug: "coastal-wellness",
        title: "Coastal Rest & Wellness",
        category: "wellness-relaxation",
        destination: "diani-beach",
        image: wellness,
        description: "Slow days by the ocean, with spa time and quiet spaces to rest.",
        considerations: ["Treatments arranged with independent providers"],
    },
    {
        slug: "private-beach-dinner",
        title: "Private Beach Dinner",
        category: "private-occasions",
        destination: "diani-beach",
        image: privateImg,
        description: "A candlelit table on the sand for anniversaries, proposals or simply a beautiful evening.",
        considerations: ["Arranged with the property or a local provider", "Weather back-up plans recommended"],
    },
];

export const getExperience = (slug: string) => EXPERIENCES.find((e) => e.slug === slug);
export const getCategory = (slug: string) => EXPERIENCE_CATEGORIES.find((c) => c.slug === slug);
