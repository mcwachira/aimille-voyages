import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import hero from "@/assets/hero-mara.jpg";
import stay from "@/assets/stay.jpg";
import diani from "@/assets/diani.jpg";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/PageHero";
import {
    DestinationCard,
    ServiceCard,
} from "@/components/site/TravelCards";
import { FinalCta } from "@/components/site/FinalCta";

import { SERVICES } from "@/content/services";
import { DESTINATIONS } from "@/content/destinations";
import { EXPERIENCE_CATEGORIES } from "@/content/experiences";
import { SITE } from "@/content/site";

// SEO metadata
export const metadata: Metadata = {
    title: "AIMILLE VOYAGES — Bespoke Travel & Concierge Services in Kenya",
    description:
        "Bespoke holidays, accommodation, transfers, curated experiences and long-stay concierge in Kenya. Explore. Experience. Travel Better.",
    alternates: {
        canonical: "/",
    },
};

// Structured data for search engines
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    description: SITE.descriptor,
    email: SITE.email,
    telephone: "+254112414190",
    areaServed: "Kenya",
    sameAs: [SITE.instagram, SITE.tiktok],
};

const STEPS = [
    [
        "Discover",
        "Tell us where you want to go, how you want to travel and what matters most to you.",
    ],
    [
        "Personalise",
        "We develop a tailored plan and coordinate suitable accommodation, transport, experiences and concierge arrangements.",
    ],
    [
        "Experience",
        "Enjoy your journey while we help coordinate the details from arrival to departure.",
    ],
];

const WHY = [
    ["Personalised attention", "Plans built around you, not a template."],
    ["One point of coordination", "A single contact for every part of your journey."],
    ["Local destination knowledge", "Kenya-based, with an eye for what's worth your time."],
    ["Flexible arrangements", "Plans that adapt as your needs change."],
    ["Considered recommendations", "Thoughtful suggestions matched to your style."],
    ["Support throughout", "From arrival to departure, we remain on hand."],
];

export default function HomePage() {
    return (
        <>
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />

            {/* Hero */}
            <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-band">
                <Image
                    src={hero}
                    alt="Golden hour over the Maasai Mara with elephants crossing the savannah"
                    fill
                    priority
                    sizes="100vw"
                    className="absolute inset-0 object-cover animate-slow-zoom"
                />

                <div className="absolute inset-0 hero-overlay" />

                <div className="container-x relative pb-20 pt-40 text-ivory md:pb-28">
                    <p className="eyebrow text-gold">
                        Bespoke Travel &amp; Concierge Services
                    </p>

                    <h1 className="mt-6 max-w-5xl text-6xl leading-[0.95] md:text-8xl lg:text-[8.5rem]">
                        Experience Kenya,{" "}
                        <em className="text-sand">Beautifully.</em>
                    </h1>

                    <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
                        <p className="max-w-xl text-lg leading-relaxed text-ivory/85">
                            From unforgettable holidays and curated experiences to
                            accommodation, transportation and personalised lifestyle
                            assistance, we take care of every detail of your journey.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                            <Link
                                href="/plan-your-trip"
                                className={buttonVariants({
                                    variant: "gold",
                                    size: "xl",
                                })}
                            >
                                Plan your experience
                            </Link>

                            <Link
                                href="/services"
                                className={buttonVariants({
                                    variant: "ghostLight",
                                    size: "xl",
                                })}
                            >
                                Explore our services
                            </Link>
                        </div>
                    </div>

                    <p className="mt-14 font-serif text-xl italic text-ivory/70">
                        {SITE.tagline}
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className="container-x grid gap-14 py-24 md:grid-cols-2 md:items-center md:py-36">
                <Reveal>
                    <SectionHeading
                        eyebrow="AIMILLE VOYAGES"
                        title="More Than Travel. A Better Way to Experience Kenya."
                    >
                        <p>
                            Every journey deserves thoughtful planning and personal attention.
                        </p>

                        <p className="mt-4">
                            At AIMILLE VOYAGES, we bring together travel planning,
                            accommodation, transportation and lifestyle concierge services
                            to make discovering Kenya effortless.
                        </p>

                        <p className="mt-4">
                            Whether you are visiting for a weekend, exploring for several
                            weeks or settling in for an extended stay, we coordinate the
                            details that make your experience comfortable and memorable.
                        </p>
                    </SectionHeading>

                    <Link
                        href="/about"
                        className={`${buttonVariants({
                            variant: "line",
                            size: "xl",
                        })} mt-10`}
                    >
                        Discover AIMILLE VOYAGES
                    </Link>
                </Reveal>

                <Reveal delay={150} className="relative">
                    <div className="relative aspect-[4/5] w-full md:ml-auto md:w-[85%]">
                        <Image
                            src={stay}
                            alt="Calm serviced apartment living room with garden views"
                            fill
                            sizes="(max-width: 768px) 100vw, 42vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="absolute -bottom-8 left-0 hidden w-48 border border-gold bg-background p-5 md:block">
                        <p className="font-serif text-xl italic text-primary">
                            "We take care of the details."
                        </p>
                    </div>
                </Reveal>
            </section>

            {/* Services */}
            <section className="bg-secondary/50 py-24 md:py-32">
                <div className="container-x">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Our Services"
                            title="Everything You Need, Thoughtfully Arranged."
                        />
                    </Reveal>

                    <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                        {SERVICES.map((s, i) => (
                            <Reveal key={s.slug} delay={(i % 3) * 100}>
                                <ServiceCard s={s} index={i} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Destinations */}
            <section className="py-24 md:py-32">
                <div className="container-x">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <Reveal>
                            <SectionHeading
                                eyebrow="Destinations"
                                title="Discover the Beauty of Kenya."
                            />
                        </Reveal>

                        <Link
                            href="/destinations"
                            className={buttonVariants({
                                variant: "line",
                                size: "xl",
                            })}
                        >
                            All destinations
                        </Link>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {DESTINATIONS.map((d, i) => (
                            <Reveal
                                key={d.slug}
                                delay={(i % 4) * 80}
                                className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}
                            >
                                <DestinationCard d={d} tall={i === 0} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="bg-band py-24 text-band-foreground md:py-32">
                <div className="container-x">
                    <Reveal>
                        <p className="eyebrow flex items-center gap-4 text-gold">
                            <span className="gold-rule" />
                            The AIMILLE Experience
                        </p>

                        <h2 className="mt-5 max-w-3xl text-4xl md:text-6xl">
                            Your Journey. Our Attention to Every Detail.
                        </h2>
                    </Reveal>

                    <div className="mt-16 grid gap-12 md:grid-cols-3">
                        {STEPS.map(([t, d], i) => (
                            <Reveal
                                key={t}
                                delay={i * 120}
                                className="border-t border-gold/50 pt-8"
                            >
                                <p className="font-serif text-6xl text-gold">
                                    0{i + 1}
                                </p>

                                <h3 className="eyebrow mt-6 text-sm text-ivory">
                                    {t}
                                </h3>

                                <p className="mt-4 leading-relaxed text-ivory/75">
                                    {d}
                                </p>
                            </Reveal>
                        ))}
                    </div>

                    <Link
                        href="/plan-your-trip"
                        className={`${buttonVariants({
                            variant: "gold",
                            size: "xl",
                        })} mt-16`}
                    >
                        Start planning
                    </Link>
                </div>
            </section>

            {/* Long Stay */}
            <section className="relative overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="relative h-[60vh] w-full md:h-auto">
                        <Image
                            src={diani}
                            alt="Palm-fringed Diani Beach with a dhow on turquoise water"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="bg-secondary px-6 py-20 md:px-16 md:py-32">
                        <Reveal>
                            <p className="eyebrow text-gold">
                                Long-Stay Concierge
                            </p>

                            <h2 className="mt-5 text-4xl text-primary md:text-6xl">
                                Staying in Kenya a Little Longer? We've Got You.
                            </h2>

                            <p className="mt-6 leading-relaxed text-primary/80">
                                Whether you're spending 30 days exploring, 60 days working
                                remotely or 90 days experiencing life in Kenya, AIMILLE
                                VOYAGES helps make your extended stay easier.
                            </p>

                            <p className="mt-4 leading-relaxed text-primary/80">
                                From finding suitable accommodation and arranging airport
                                transfers to local orientation, transportation and lifestyle
                                assistance, we help you feel at home.
                            </p>

                            <div className="mt-10 grid grid-cols-2 gap-px border border-gold/40 bg-gold/40">
                                {[
                                    "30-day stays",
                                    "60-day stays",
                                    "90-day stays",
                                    "Extended stays",
                                ].map((x) => (
                                    <div key={x} className="bg-secondary p-5">
                                        <p className="font-serif text-2xl text-primary">
                                            {x}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/long-stay"
                                className={`${buttonVariants({
                                    variant: "brand",
                                    size: "xl",
                                })} mt-10`}
                            >
                                Explore long-stay services
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Experiences */}
            <section className="py-24 md:py-32">
                <div className="container-x">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Experiences"
                            title="Find Your Kind of Extraordinary."
                        />
                    </Reveal>

                    <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
                        {EXPERIENCE_CATEGORIES.slice(0, 6).map((c, i) => (
                            <Reveal key={c.slug} delay={(i % 3) * 80}>
                                <Link
                                    href={`/experiences?category=${encodeURIComponent(c.slug)}`}
                                    className="group relative block aspect-square overflow-hidden bg-band md:aspect-[4/5]"
                                >
                                    <Image
                                        src={c.image}
                                        alt={c.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="img-zoom object-cover group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 card-overlay" />

                                    <h3 className="absolute bottom-5 left-5 right-5 text-2xl text-ivory md:text-3xl">
                                        {c.name}
                                    </h3>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    <Link
                        href="/experiences"
                        className={`${buttonVariants({
                            variant: "line",
                            size: "xl",
                        })} mt-12`}
                    >
                        Explore experiences
                    </Link>
                </div>
            </section>

            {/* Why AIMILLE VOYAGES */}
            <section className="border-t border-border bg-card py-24 md:py-32">
                <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.4fr]">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Why AIMILLE VOYAGES"
                            title="Thoughtful Travel. Personalised Service."
                        />
                    </Reveal>

                    <div className="grid gap-px bg-border sm:grid-cols-2">
                        {WHY.map(([t, d]) => (
                            <div key={t} className="bg-card p-8">
                                <span className="gold-rule" />

                                <h3 className="mt-5 text-2xl text-primary">
                                    {t}
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            {/*<FinalCta />*/}
        </>
    );
}
