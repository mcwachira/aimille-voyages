import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import watamu from "@/assets/watamu.jpg";
import { PageHero } from "@/components/site/PageHero";
import { DestinationCard } from "@/components/site/TravelCards";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { buttonVariants } from "@/components/ui/button";
import { waMsg } from "@/content/site";
import { DestinationViewTracker } from "@/components/site/DestinationViewTracker";
import { client } from "@/sanity/lib/client";
import {
    DESTINATIONS_QUERY,
    DESTINATION_BY_SLUG_QUERY,
} from "@/sanity/queries";
import { sanityImageUrl } from "@/sanity/lib/image";
import type { SanityDestination } from "@/sanity/types";

type DestinationPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const destinations = (await client.fetch(
        DESTINATIONS_QUERY,
    )) as SanityDestination[];

    return destinations.map((destination) => ({
        slug: destination.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: DestinationPageProps): Promise<Metadata> {
    const { slug } = await params;

    const destination = (await client.fetch(DESTINATION_BY_SLUG_QUERY, {
        slug,
    })) as SanityDestination | null;

    if (!destination) {
        return {
            title: "Destination not found | AIMILLE VOYAGES",
        };
    }

    const title =
        destination.seo?.metaTitle ||
        `${destination.name}, ${destination.country} | Travel Guide | AIMILLE VOYAGES`;

    const description =
        destination.seo?.metaDescription || destination.summary;

    return {
        title,
        description,
        alternates: {
            canonical: `/destinations/${destination.slug}`,
        },
        openGraph: {
            title,
            description,
            type: "article",
        },
    };
}

export default async function DestinationPage({
                                                  params,
                                              }: DestinationPageProps) {
    const { slug } = await params;

    const destination = (await client.fetch(DESTINATION_BY_SLUG_QUERY, {
        slug,
    })) as SanityDestination | null;

    if (!destination) {
        notFound();
    }

    const related = destination.related ?? [];

    return (
        <>
            <DestinationViewTracker slug={destination.slug} />

            <PageHero
                image={sanityImageUrl(destination.image, watamu)}
                alt={`${destination.name}, ${destination.country}`}
                eyebrow={`${destination.region ?? ""} · ${destination.country}`}
                title={destination.name}
            >
                {destination.summary}
            </PageHero>

            <section className="container-x grid gap-16 py-24 lg:grid-cols-[1.3fr_1fr]">
                <div>
                    {destination.intro && (
                        <p className="font-serif text-3xl leading-snug text-primary md:text-4xl">
                            {destination.intro}
                        </p>
                    )}

                    {!!destination.special?.length && (
                        <>
                            <h2 className="eyebrow mt-16 text-gold-readable">
                                What makes it special
                            </h2>

                            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                                {destination.special.map((item) => (
                                    <li
                                        key={item}
                                        className="border-t border-gold/50 pt-4 text-muted-foreground"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {!!destination.experiences?.length && (
                        <>
                            <h2 className="eyebrow mt-16 text-gold-readable">
                                Suggested experiences
                            </h2>

                            <ul className="mt-6 flex flex-wrap gap-3">
                                {destination.experiences.map((experience) => (
                                    <li
                                        key={experience}
                                        className="border border-border px-4 py-2 text-sm"
                                    >
                                        {experience}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <aside className="h-fit space-y-8 bg-secondary/60 p-8 md:p-10">
                    <Info title="Accommodation">
                        {destination.accommodation}
                    </Info>

                    <Info title="Getting there & around">
                        {destination.transport}
                    </Info>

                    <Info title="Recommended length of stay">
                        {destination.stayLength}
                    </Info>

                    <div className="flex flex-col gap-3 pt-4">
                        <Link
                            href="/plan-your-trip"
                            className={buttonVariants({
                                variant: "brand",
                                size: "xl",
                            })}
                        >
                            Enquire about {destination.name}
                        </Link>

                        <WhatsAppLink
                            location={`destination_${destination.slug}`}
                            variant="line"
                            message={waMsg(`travelling to ${destination.name}`)}
                        >
                            Ask on WhatsApp
                        </WhatsAppLink>
                    </div>
                </aside>
            </section>

            {related.length > 0 && (
                <section className="container-x pb-24">
                    <h2 className="text-4xl text-primary">Related destinations</h2>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map((item) => (
                            <DestinationCard key={item._id} d={item} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

function Info({
                  title,
                  children,
              }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div>
            <p className="eyebrow text-gold-readable">{title}</p>
            <p className="mt-3 text-sm leading-relaxed text-primary/85">
                {children}
            </p>
        </div>
    );
}