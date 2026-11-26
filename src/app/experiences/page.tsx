import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import adventure from "@/assets/adventure.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { FinalCta } from "@/components/site/FinalCta";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
    EXPERIENCE_CATEGORIES_QUERY,
    EXPERIENCES_QUERY,
} from "@/sanity/queries";
import { sanityImageUrl } from "@/sanity/lib/image";
import type {
    SanityExperience,
    SanityExperienceCategory,
} from "@/sanity/types";

export const metadata: Metadata = {
    title: "Private Travel Experiences in Kenya | AIMILLE VOYAGES",
    description:
        "Wildlife and safari, beaches, culture, food, adventure, wellness and private occasions. Discover curated Kenyan experiences.",
    alternates: {
        canonical: "/experiences",
    },
    openGraph: {
        title: "Private Travel Experiences in Kenya | AIMILLE VOYAGES",
        description:
            "Discover curated wildlife, safari, beach, culture, food, adventure, wellness and private experiences in Kenya.",
        type: "website",
    },
};

type ExperiencesPageProps = {
    searchParams: Promise<{
        category?: string | string[];
    }>;
};

export default async function ExperiencesPage({
                                                  searchParams,
                                              }: ExperiencesPageProps) {
    const params = await searchParams;

    const requestedCategory = Array.isArray(params.category)
        ? params.category[0]
        : params.category;

    const [categories, experiences] = await Promise.all([
        client.fetch(EXPERIENCE_CATEGORIES_QUERY),
        client.fetch(EXPERIENCES_QUERY),
    ]) as [SanityExperienceCategory[], SanityExperience[]];



    const category = categories.find(
        (item) => item.slug === requestedCategory,
    );

    const list = category
        ? experiences.filter(
            (experience) => experience.category?.slug === category.slug,
        )
        : experiences;

    return (
        <>
            <PageHero
                image={adventure}
                alt="Hot air balloons over the Maasai Mara at sunrise"
                eyebrow="Experiences"
                title="Find Your Kind of Extraordinary."
            />

            <section className="container-x py-20">
                <div className="flex flex-wrap gap-2">
                    <CategoryChip active={!category} href="/experiences">
                        All
                    </CategoryChip>

                    {categories.map((item) => (
                        <CategoryChip
                            key={item._id}
                            active={category?.slug === item.slug}
                            href={`/experiences?category=${encodeURIComponent(item.slug)}`}
                        >
                            {item.name}
                        </CategoryChip>
                    ))}
                </div>

                <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((experience, index) => (
                        <Reveal
                            key={experience._id}
                            delay={(index % 3) * 80}
                        >
                            <Link
                                href={`/experiences/${experience.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                                    <Image
                                        src={sanityImageUrl(experience.image, adventure)}
                                        alt={experience.title}
                                        fill
                                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                        className="img-zoom object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <p className="eyebrow mt-5 text-gold-readable">
                                    {experience.category?.name}
                                    {experience.destination &&
                                        ` · ${experience.destination.name}`}
                                </p>

                                <h2 className="mt-2 text-3xl text-primary">
                                    {experience.title}
                                </h2>

                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                    {experience.description}
                                </p>
                            </Link>
                        </Reveal>
                    ))}
                </div>

                {list.length === 0 && (
                    <p className="py-16 text-center text-muted-foreground">
                        No experiences are currently available in this category.
                    </p>
                )}
            </section>

            <FinalCta topic="curated experiences in Kenya" />
        </>
    );
}

function CategoryChip({
                          active,
                          href,
                          children,
                      }: {
    active: boolean;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-gold",
            )}
        >
            {children}
        </Link>
    );
}