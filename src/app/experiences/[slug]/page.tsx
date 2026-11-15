
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    EXPERIENCES,
    getExperience,
    getCategory,
    verifiedDuration,
} from "@/content/experiences";
import { getDestination } from "@/content/destinations";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppLink } from "@/components/site/WhatsAppLink";
import { waMsg, SUPPLIER_NOTE } from "@/content/site";

type ExperiencePageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return EXPERIENCES.map((experience) => ({
        slug: experience.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: ExperiencePageProps): Promise<Metadata> {
    const { slug } = await params;
    const experience = getExperience(slug);

    if (!experience) {
        return {
            title: "Experience not found | AIMILLE VOYAGES",
        };
    }

    const title = `${experience.title} | Kenya Experience | AIMILLE VOYAGES`;
    const description = experience.description;

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
    const experience = getExperience(slug);

    if (!experience) {
        notFound();
    }

    const category = getCategory(experience.category);
    const destination = getDestination(experience.destination);
    const duration = verifiedDuration(experience);

    return (
        <>
            <PageHero
                image={experience.image}
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
                            <dt className="eyebrow text-gold">Destination</dt>
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
                            <dt className="eyebrow text-gold">Category</dt>
                            <dd className="mt-2 font-serif text-2xl text-primary">
                                {category?.name ?? "Experience"}
                            </dd>
                        </div>

                        {duration && (
                            <div>
                                <dt className="eyebrow text-gold">Duration</dt>
                                <dd className="mt-2 font-serif text-2xl text-primary">
                                    {duration}
                                </dd>
                            </div>
                        )}
                    </dl>

                    <h2 className="eyebrow mt-12 text-gold">
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
