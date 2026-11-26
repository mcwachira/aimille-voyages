import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import adventure from "@/assets/adventure.jpg";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { waMsg, SUPPLIER_NOTE } from "@/content/site";
import { client } from "@/sanity/lib/client";
import {
    EXPERIENCES_QUERY,
    EXPERIENCE_BY_SLUG_QUERY,
} from "@/sanity/queries";
import { sanityImageUrl } from "@/sanity/lib/image";
import type { SanityExperience } from "@/sanity/types";

type ExperiencePageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const experiences = (await client.fetch(
        EXPERIENCES_QUERY,
    )) as SanityExperience[];

    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: ExperiencePageProps): Promise<Metadata> {
    const { slug } = await params;

    const experience = (await client.fetch(EXPERIENCE_BY_SLUG_QUERY, {
        slug,
    })) as SanityExperience | null;

    if (!experience) {
        return {
            title: "Experience not found | AIMILLE VOYAGES",
        };
    }

    const title =
        experience.seo?.metaTitle ||
        `${experience.title} | Kenya Experience | AIMILLE VOYAGES`;

    const description =
        experience.seo?.metaDescription || experience.description;

    return {
        title,
        description,
        alternates: {
            canonical: `/experiences/${experience.slug}`,
        },
        openGraph: {
            title,
            description,
            type: "article",
        },
    };
}

export default async function ExperiencePage({
                                                 params,
                                             }: ExperiencePageProps) {
    const { slug } = await params;

    const experience = (await client.fetch(EXPERIENCE_BY_SLUG_QUERY, {
        slug,
    })) as SanityExperience | null;

    if (!experience) {
        notFound();
    }

    const category = experience.category;
    const destination = experience.destination;

    const duration =
        experience.duration && experience.durationVerified
            ? experience.duration
            : undefined;

    return (
        <>
            <PageHero
                image={sanityImageUrl(experience.image, adventure)}
                alt={experience.title}
                eyebrow={category?.name}
                title={experience.title}
            >
                {experience.description}
            </PageHero>

            <section className="container-x grid gap-16 py-24 lg:grid-cols-[1fr_1.1fr]">
                <div>
                    <dl className="grid grid-cols-2 gap-6 border-y border-border py-6">
                        <div>
                            <dt className="eyebrow text-gold-readable">Destination</dt>
                            <dd className="mt-2 font-serif text-2xl text-primary">
                                {destination ? (
                                    <Link
                                        href={`/destinations/${destination.slug}`}
                                        className="underline-offset-4 hover:underline"
                                    >
                                        {destination.name}
                                    </Link>
                                ) : (
                                    "To be confirmed"
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt className="eyebrow text-gold-readable">Category</dt>
                            <dd className="mt-2 font-serif text-2xl text-primary">
                                {category?.name ?? "Experience"}
                            </dd>
                        </div>

                        {duration && (
                            <div>
                                <dt className="eyebrow text-gold-readable">Duration</dt>
                                <dd className="mt-2 font-serif text-2xl text-primary">
                                    {duration}
                                </dd>
                            </div>
                        )}
                    </dl>

                    {!!experience.considerations?.length && (
                        <>
                            <h2 className="eyebrow mt-12 text-gold-readable">
                                Important considerations
                            </h2>

                            <ul className="mt-5 space-y-3">
                                {experience.considerations.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 text-muted-foreground"
                                    >
                                        <span className="mt-3 h-px w-5 shrink-0 bg-gold" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
                        {SUPPLIER_NOTE}
                    </p>

                    <WhatsAppLink
                        location={`experience_${experience.slug}`}
                        variant="line"
                        className="mt-8"
                        message={waMsg(`the "${experience.title}" experience`)}
                    >
                        Ask on WhatsApp
                    </WhatsAppLink>
                </div>

                <div className="border border-border bg-card p-6 md:p-10">
                    <h2 className="mb-8 text-4xl text-primary">
                        Enquire about this experience
                    </h2>

                    <EnquiryForm
                        category="experiences"
                        sourcePage={`/experiences/${experience.slug}`}
                        whatsappTopic={`the "${experience.title}" experience`}
                        defaults={{
                            destination: destination?.name ?? "",
                            experience_category: category?.name ?? "",
                            preferences: `Interested in: ${experience.title}`,
                        }}
                    />
                </div>
            </section>
        </>
    );
}