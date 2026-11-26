import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import adventure from "@/assets/adventure.jpg";
import { FinalCta } from "@/components/site/FinalCta";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { editorialDetailPath, type PublicContentKind } from "@/lib/public-content-routes";
import { sanityImageUrl } from "@/sanity/lib/image";
import type { SanityImage, SanityRelatedDestination, SanityRelatedExperience } from "@/sanity/types";

export type EditorialCardData = {
    title: string;
    slug: string;
    summary: string;
    image?: SanityImage;
    eyebrow?: string;
    kind: PublicContentKind;
};

export function EditorialCard({ item }: { item: EditorialCardData }) {
    return (
        <Link href={editorialDetailPath(item.kind, item.slug)} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <Image
                    src={sanityImageUrl(item.image, adventure)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="img-zoom object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            {item.eyebrow && <p className="eyebrow mt-5 text-gold-readable">{item.eyebrow}</p>}
            <h2 className="mt-2 font-serif text-3xl text-primary">{item.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            <span className="eyebrow mt-4 inline-flex items-center gap-2 border-b border-gold pb-1 text-primary">
                Discover more
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
        </Link>
    );
}

export function EditorialListing({
    kind,
    title,
    description,
    heroTitle,
    heroAlt,
    heroImage,
    items,
    emptyMessage,
}: {
    kind: PublicContentKind;
    title: string;
    description: string;
    heroTitle: string;
    heroAlt: string;
    heroImage: StaticImageData | string;
    items: EditorialCardData[];
    emptyMessage: string;
}) {
    return (
        <>
            <PageHero image={heroImage} alt={heroAlt} eyebrow={title} title={heroTitle}>
                {description}
            </PageHero>
            <section className="container-x py-20 md:py-28">
                <SectionHeading eyebrow="Explore" title={title} />
                {items.length ? (
                    <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => <EditorialCard key={`${kind}-${item.slug}`} item={item} />)}
                    </div>
                ) : (
                    <p className="mt-12 border-y border-border py-12 text-center text-muted-foreground">{emptyMessage}</p>
                )}
            </section>
            <FinalCta topic={title.toLowerCase()} />
        </>
    );
}

export function EditorialBody({ body }: { body?: string }) {
    const paragraphs = body?.split(/\r?\n\s*\r?\n/).map((part) => part.trim()).filter(Boolean) ?? [];
    return (
        <div className="space-y-5 text-base leading-8 text-muted-foreground">
            {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`} className="whitespace-pre-line">{paragraph}</p>)}
        </div>
    );
}

export function RelatedTravelLinks({
    destinations = [],
    experiences = [],
}: {
    destinations?: Array<SanityRelatedDestination | null>;
    experiences?: Array<SanityRelatedExperience | null>;
}) {
    const availableDestinations = destinations.filter((destination): destination is SanityRelatedDestination => Boolean(destination?.slug));
    const availableExperiences = experiences.filter((experience): experience is SanityRelatedExperience => Boolean(experience?.slug));
    if (!availableDestinations.length && !availableExperiences.length) return null;

    return (
        <section className="container-x border-t border-border py-16 md:py-20">
            <h2 className="font-serif text-3xl text-primary md:text-4xl">Continue exploring</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableDestinations.map((destination) => (
                    <Link key={destination._id} href={`/destinations/${encodeURIComponent(destination.slug)}`} className="border border-border p-5 transition-colors hover:border-gold">
                        <span className="eyebrow text-gold-readable">Destination</span>
                        <span className="mt-2 block font-serif text-2xl text-primary">{destination.name}</span>
                        {destination.country && <span className="mt-1 block text-sm text-muted-foreground">{destination.region ? `${destination.region} · ` : ""}{destination.country}</span>}
                    </Link>
                ))}
                {availableExperiences.map((experience) => (
                    <Link key={experience._id} href={`/experiences/${encodeURIComponent(experience.slug)}`} className="border border-border p-5 transition-colors hover:border-gold">
                        <span className="eyebrow text-gold-readable">Experience</span>
                        <span className="mt-2 block font-serif text-2xl text-primary">{experience.title}</span>
                        {experience.durationVerified && experience.duration && <span className="mt-1 block text-sm text-muted-foreground">{experience.duration}</span>}
                    </Link>
                ))}
            </div>
        </section>
    );
}

export function EditorialDetail({
    title,
    summary,
    body,
    image,
    fallbackImage,
    eyebrow,
    facts = [],
    destinations,
    experiences,
}: {
    title: string;
    summary: string;
    body?: string;
    image?: SanityImage;
    fallbackImage: StaticImageData | string;
    eyebrow: string;
    facts?: Array<{ label: string; value: string }>;
    destinations?: Array<SanityRelatedDestination | null>;
    experiences?: Array<SanityRelatedExperience | null>;
}) {
    const hasBody = Boolean(body?.trim());
    return (
        <>
            <PageHero image={sanityImageUrl(image, fallbackImage)} alt={title} eyebrow={eyebrow} title={title}>
                {summary}
            </PageHero>
            {(hasBody || facts.length > 0) && <section className={`container-x gap-12 py-16 md:py-24 ${hasBody && facts.length > 0 ? "grid lg:grid-cols-[1.4fr_0.6fr] lg:gap-16" : "space-y-10"}`}>
                {hasBody && <EditorialBody body={body} />}
                {facts.length > 0 && (
                    <aside className="h-fit bg-secondary/60 p-7 md:p-9">
                        <h2 className="eyebrow text-gold-readable">At a glance</h2>
                        <dl className="mt-5 divide-y divide-border">
                            {facts.map((fact) => <div key={fact.label} className="py-4 first:pt-0 last:pb-0"><dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{fact.label}</dt><dd className="mt-1 font-serif text-xl text-primary">{fact.value}</dd></div>)}
                        </dl>
                    </aside>
                )}
            </section>}
            <RelatedTravelLinks destinations={destinations} experiences={experiences} />
            <FinalCta topic={title} />
        </>
    );
}
