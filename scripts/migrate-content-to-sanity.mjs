
import { createClient } from "next-sanity";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-14";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
    throw new Error(
        "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN"
    );
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
});

const root = process.cwd();
const assetsDirectory = path.join(root, "src", "assets");

const imageCache = new Map();

async function uploadImage(filename) {
    if (imageCache.has(filename)) {
        return imageCache.get(filename);
    }

    const filePath = path.join(assetsDirectory, filename);

    try {
        await access(filePath);
    } catch {
        throw new Error(`Image file not found: ${filePath}`);
    }

    console.log(`Uploading image: ${filename}`);

    const asset = await client.assets.upload(
        "image",
        createReadStream(filePath),
        { filename }
    );

    const imageReference = {
        _type: "image",
        asset: {
            _type: "reference",
            _ref: asset._id,
        },
    };

    imageCache.set(filename, imageReference);

    return imageReference;
}

function reference(id) {
    return {
        _type: "reference",
        _ref: id,
    };
}

const destinations = [
    {
        slug: "nairobi",
        name: "Nairobi",
        country: "Kenya",
        region: "Central Kenya",
        imageFile: "nairobi.jpg",
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
        experiences: [
            "City and cultural orientation",
            "Nairobi National Park game drive",
            "Food and market discovery",
            "Art and craft visits",
        ],
        accommodation:
            "Options range from city hotels to serviced apartments in quieter residential areas — well suited to longer stays and families.",
        transport:
            "Traffic can be heavy at peak hours, so private transfers and a planned daily rhythm make a real difference.",
        stayLength:
            "2–4 days for a visit; Nairobi also works well as a long-stay base.",
        related: ["maasai-mara", "amboseli"],
    },
    {
        slug: "maasai-mara",
        name: "Maasai Mara",
        country: "Kenya",
        region: "South-West Kenya",
        imageFile: "hero-mara.jpg",
        summary:
            "Discover extraordinary wildlife, expansive savannahs and iconic safari landscapes.",
        intro:
            "The Maasai Mara is Kenya's most celebrated safari destination: rolling golden plains, acacia-dotted horizons and some of the richest wildlife viewing on the continent, together with the surrounding conservancies.",
        special: [
            "Exceptional year-round wildlife viewing",
            "Seasonal wildebeest migration, typically in the drier months",
            "Private conservancies offering a quieter experience",
            "Maasai culture and community",
        ],
        experiences: [
            "Game drives",
            "Sunrise balloon flights",
            "Guided bush walks in conservancies",
            "Cultural visits",
        ],
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
        imageFile: "amboseli.jpg",
        summary:
            "Experience remarkable wildlife encounters against the backdrop of Mount Kilimanjaro.",
        intro:
            "Amboseli is known for its large elephant herds and wide open plains framed by Mount Kilimanjaro across the border — on clear mornings, one of Africa's most memorable views.",
        special: [
            "Elephants against the silhouette of Kilimanjaro",
            "Open terrain, good for photography",
            "Wetlands that attract birdlife",
            "Accessible by road or air from Nairobi",
        ],
        experiences: [
            "Early morning game drives",
            "Photography-focused safaris",
            "Community visits",
        ],
        accommodation:
            "Lodges and tented camps inside and around the park, with views of the mountain from many.",
        transport:
            "Around four to five hours by road from Nairobi, or a short scheduled flight.",
        stayLength: "2–3 nights.",
        related: ["tsavo", "maasai-mara"],
    },
    {
        slug: "tsavo",
        name: "Tsavo",
        country: "Kenya",
        region: "South-East Kenya",
        imageFile: "tsavo.jpg",
        summary:
            "Explore vast wilderness, distinctive landscapes and unforgettable safari experiences.",
        intro:
            "Tsavo East and Tsavo West together form one of the largest protected areas in Kenya — red earth, volcanic hills, springs and a sense of genuine wilderness that pairs naturally with time on the coast.",
        special: [
            "Red-dusted elephants and wide horizons",
            "Volcanic landscapes and natural springs in Tsavo West",
            "Fewer vehicles and a sense of space",
            "Easy combination with Diani, Watamu or Mombasa",
        ],
        experiences: [
            "Game drives",
            "Safari-and-beach combinations",
            "Scenic landscape excursions",
        ],
        accommodation:
            "Lodges and camps spread across a vast area — location matters for drive times.",
        transport:
            "Reachable by road from Mombasa or Nairobi, or by rail to stations near the parks.",
        stayLength: "2–3 nights, often combined with the coast.",
        related: ["diani-beach", "mombasa"],
    },
    {
        slug: "diani-beach",
        name: "Diani Beach",
        country: "Kenya",
        region: "South Coast",
        imageFile: "diani.jpg",
        summary:
            "Discover white-sand beaches, turquoise waters and relaxed coastal living.",
        intro:
            "Diani is a long stretch of white sand on Kenya's south coast, with warm water, coral reef, and a relaxed pace that suits honeymoons, families and longer coastal stays.",
        special: [
            "Long, palm-fringed white-sand beach",
            "Reef, snorkelling and dhow trips",
            "Relaxed coastal lifestyle",
            "Popular with long-stay visitors",
        ],
        experiences: [
            "Dhow sailing",
            "Snorkelling",
            "Beach dining",
            "Wellness and relaxation",
        ],
        accommodation:
            "Beach hotels, boutique properties, private villas and longer-term rentals.",
        transport:
            "Domestic flights to the south coast or road transfers from Mombasa.",
        stayLength: "4–7 nights; many guests stay much longer.",
        related: ["watamu", "mombasa"],
    },
    {
        slug: "watamu",
        name: "Watamu",
        country: "Kenya",
        region: "North Coast",
        imageFile: "watamu.jpg",
        summary:
            "Experience beautiful beaches, marine life and the charm of Kenya's coastline.",
        intro:
            "Watamu is a smaller, quieter coastal village known for its lagoons, coral rock islets and protected marine environment — ideal for slow travel and nature lovers.",
        special: [
            "Marine conservation area and coral gardens",
            "Tidal lagoons and sandbanks",
            "Nearby forest and historic ruins",
            "A quieter village atmosphere",
        ],
        experiences: [
            "Snorkelling and marine excursions",
            "Forest walks",
            "Coastal heritage visits",
        ],
        accommodation: "Boutique hotels, beach houses and private villas.",
        transport:
            "Domestic flights to nearby Malindi, then a short road transfer.",
        stayLength: "4–7 nights.",
        related: ["diani-beach", "mombasa"],
    },
    {
        slug: "mombasa",
        name: "Mombasa",
        country: "Kenya",
        region: "Coast",
        imageFile: "mombasa.jpg",
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
        experiences: [
            "Old Town heritage walks",
            "Swahili food experiences",
            "Harbour and dhow trips",
        ],
        accommodation: "City and beach hotels north and south of the island.",
        transport:
            "Reachable by domestic flight, rail or road from Nairobi.",
        stayLength: "1–2 days, often combined with the beach.",
        related: ["diani-beach", "tsavo"],
    },
];

const categories = [
    {
        slug: "wildlife-safari",
        name: "Wildlife & Safari",
        imageFile: "amboseli.jpg",
        blurb: "Savannahs, game drives and unforgettable encounters.",
    },
    {
        slug: "beaches-coastal",
        name: "Beaches & Coastal Escapes",
        imageFile: "diani.jpg",
        blurb: "White sand, warm water and slow coastal days.",
    },
    {
        slug: "culture-heritage",
        name: "Culture & Heritage",
        imageFile: "culture.jpg",
        blurb: "Communities, crafts and centuries of history.",
    },
    {
        slug: "food-dining",
        name: "Food & Dining",
        imageFile: "dining.jpg",
        blurb: "Swahili flavours, markets and memorable tables.",
    },
    {
        slug: "adventure-outdoors",
        name: "Adventure & Outdoors",
        imageFile: "adventure.jpg",
        blurb: "Balloon flights, walks and wide open spaces.",
    },
    {
        slug: "wellness-relaxation",
        name: "Wellness & Relaxation",
        imageFile: "wellness.jpg",
        blurb: "Unhurried time to rest and restore.",
    },
    {
        slug: "private-occasions",
        name: "Private & Special Occasions",
        imageFile: "private.jpg",
        blurb: "Celebrations, proposals and private moments.",
    },
];

const experiences = [
    {
        slug: "maasai-mara-game-drives",
        title: "Game Drives in the Maasai Mara",
        category: "wildlife-safari",
        destination: "maasai-mara",
        imageFile: "hero-mara.jpg",
        description:
            "Early mornings and golden afternoons on the plains with experienced guides, in search of the Mara's remarkable wildlife.",
        considerations: [
            "Wildlife sightings are never guaranteed",
            "Park and conservancy fees apply",
            "Subject to supplier availability",
        ],
    },
    {
        slug: "amboseli-kilimanjaro-safari",
        title: "Elephants Beneath Kilimanjaro",
        category: "wildlife-safari",
        destination: "amboseli",
        imageFile: "amboseli.jpg",
        description:
            "Watch Amboseli's elephant families cross the open plains with Kilimanjaro rising behind them.",
        considerations: [
            "Mountain views depend on weather",
            "Best light is early morning",
        ],
    },
    {
        slug: "diani-dhow-snorkelling",
        title: "Dhow Sailing & Snorkelling",
        category: "beaches-coastal",
        destination: "diani-beach",
        imageFile: "diani.jpg",
        description:
            "Sail a traditional dhow along the south coast and snorkel over the reef in clear, warm water.",
        considerations: [
            "Conditions depend on tides and weather",
            "Suitable swimming ability recommended",
        ],
    },
    {
        slug: "watamu-marine-lagoons",
        title: "Watamu Lagoons & Marine Life",
        category: "beaches-coastal",
        destination: "watamu",
        imageFile: "watamu.jpg",
        description:
            "Explore sandbanks, coral islets and protected waters on Kenya's quieter north coast.",
        considerations: [
            "Tidal timing shapes the day",
            "Marine park rules apply",
        ],
    },
    {
        slug: "mombasa-old-town-walk",
        title: "Mombasa Old Town Heritage Walk",
        category: "culture-heritage",
        destination: "mombasa",
        imageFile: "mombasa.jpg",
        description:
            "Wander narrow lanes of carved doors and coral-stone buildings and learn the story of the Swahili coast.",
        considerations: [
            "Modest dress is appreciated",
            "Comfortable walking shoes recommended",
        ],
    },
    {
        slug: "beadwork-and-community",
        title: "Craft & Community Visits",
        category: "culture-heritage",
        destination: "maasai-mara",
        imageFile: "culture.jpg",
        description:
            "Meet local artisans and learn about traditional beadwork and the meaning behind its colours and patterns.",
        considerations: [
            "Visits are arranged respectfully with communities",
            "Photography only with permission",
        ],
    },
    {
        slug: "swahili-coastal-dining",
        title: "Swahili Coastal Dining",
        category: "food-dining",
        destination: "mombasa",
        imageFile: "dining.jpg",
        description:
            "Discover the coast through its food — grilled fish, coconut curries, pilau and fresh tropical fruit.",
        considerations: [
            "Let us know about dietary requirements",
            "Restaurant arrangements subject to availability",
        ],
    },
    {
        slug: "nairobi-food-and-markets",
        title: "Nairobi Food & Market Discovery",
        category: "food-dining",
        destination: "nairobi",
        imageFile: "nairobi.jpg",
        description:
            "From local favourites to contemporary kitchens, explore how Nairobi eats.",
        considerations: ["Recommendations tailored to your tastes"],
    },
    {
        slug: "mara-balloon-flight",
        title: "Sunrise Balloon Flight",
        category: "adventure-outdoors",
        destination: "maasai-mara",
        imageFile: "adventure.jpg",
        description:
            "Drift over the Mara at first light as mist lifts from the plains below.",
        considerations: [
            "Weather dependent",
            "Age and health restrictions may apply",
            "Subject to operator availability",
        ],
    },
    {
        slug: "coastal-wellness",
        title: "Coastal Rest & Wellness",
        category: "wellness-relaxation",
        destination: "diani-beach",
        imageFile: "wellness.jpg",
        description:
            "Slow days by the ocean, with spa time and quiet spaces to rest.",
        considerations: [
            "Treatments arranged with independent providers",
        ],
    },
    {
        slug: "private-beach-dinner",
        title: "Private Beach Dinner",
        category: "private-occasions",
        destination: "diani-beach",
        imageFile: "private.jpg",
        description:
            "A candlelit table on the sand for anniversaries, proposals or simply a beautiful evening.",
        considerations: [
            "Arranged with the property or a local provider",
            "Weather back-up plans recommended",
        ],
    },
];

async function migrate() {
    console.log("\nStarting AIMILLE VOYAGES Sanity migration...\n");

    const destinationIds = Object.fromEntries(
        destinations.map((item) => [
            item.slug,
            `destination-${item.slug}`,
        ])
    );

    const categoryIds = Object.fromEntries(
        categories.map((item) => [
            item.slug,
            `experienceCategory-${item.slug}`,
        ])
    );

    const experienceIds = Object.fromEntries(
        experiences.map((item) => [
            item.slug,
            `experience-${item.slug}`,
        ])
    );

    // 1. Upload destination and category images.
    // The uploadImage cache prevents uploading the same file twice.

    console.log("Preparing images...\n");

    // 2. Create experience categories.

    console.log("\nMigrating experience categories...\n");

    for (const item of categories) {
        const image = await uploadImage(item.imageFile);

        await client.createOrReplace({
            _id: categoryIds[item.slug],
            _type: "experienceCategory",
            name: item.name,
            slug: {
                _type: "slug",
                current: item.slug,
            },
            image,
            blurb: item.blurb,
            order: categories.indexOf(item) + 1,
        });

        console.log(`Category migrated: ${item.name}`);
    }

    // 3. Create destinations with related references.

    console.log("\nMigrating destinations...\n");

    for (const item of destinations) {
        const image = await uploadImage(item.imageFile);

        await client.createOrReplace({
            _id: destinationIds[item.slug],
            _type: "destination",
            name: item.name,
            slug: {
                _type: "slug",
                current: item.slug,
            },
            country: item.country,
            region: item.region,
            image,
            summary: item.summary,
            intro: item.intro,
            special: item.special,
            experiences: item.experiences,
            accommodation: item.accommodation,
            transport: item.transport,
            stayLength: item.stayLength,
            related: item.related.map((slug) => reference(destinationIds[slug])),
            featured: false,
        });

        console.log(`Destination migrated: ${item.name}`);
    }

    // 4. Create experiences with destination/category references.

    console.log("\nMigrating experiences...\n");

    for (const item of experiences) {
        const image = await uploadImage(item.imageFile);

        await client.createOrReplace({
            _id: experienceIds[item.slug],
            _type: "experience",
            title: item.title,
            slug: {
                _type: "slug",
                current: item.slug,
            },
            category: reference(categoryIds[item.category]),
            destination: reference(destinationIds[item.destination]),
            image,
            description: item.description,
            considerations: item.considerations,
            featured: false,
            order: experiences.indexOf(item) + 1,

            // The original content has no verified durations.
            durationVerified: false,
        });

        console.log(`Experience migrated: ${item.title}`);
    }

    // 5. Verify document counts.

    const counts = await client.fetch(`{
    "destinations": count(*[_type == "destination"]),
    "categories": count(*[_type == "experienceCategory"]),
    "experiences": count(*[_type == "experience"])
  }`);

    console.log("\nMigration completed.");
    console.log("Current Sanity document counts:");
    console.log(counts);

    console.log("\nExpected migrated records:");
    console.log({
        destinations: destinations.length,
        categories: categories.length,
        experiences: experiences.length,
    });
}

migrate().catch((error) => {
    console.error("\nMigration failed:");
    console.error(error);
    process.exitCode = 1;
});
