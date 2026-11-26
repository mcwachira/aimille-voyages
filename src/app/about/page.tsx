
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import culture from "@/assets/culture.jpg";
import amboseli from "@/assets/amboseli.jpg";

import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "About AIMILLE VOYAGES | Kenya Travel & Lifestyle Concierge",
    description:
        "A Kenya-based travel and lifestyle concierge making discovering Kenya more personal, comfortable and effortless.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About AIMILLE VOYAGES",
        description:
            "Discover the people, purpose and values behind AIMILLE VOYAGES, your travel and lifestyle concierge in Kenya.",
        url: "/about",
        type: "website",
    },
};

const VALUES = [
    "Personalisation",
    "Hospitality",
    "Integrity",
    "Attention to detail",
    "Authentic experiences",
    "Trust",
    "Excellence",
];

export default function AboutPage() {
    return (
        <>
            <PageHero
                image={amboseli}
                alt="Elephants beneath Mount Kilimanjaro in Amboseli"
                eyebrow="About Us"
                title="Travel Is Personal. So Is the Way We Do It."
            >
                We believe the best journeys are built around people, not packages.
            </PageHero>

            {/* Our Story */}
            <section className="container-x grid items-center gap-12 py-20 md:grid-cols-2 md:gap-16 md:py-28 lg:gap-24">
                <Reveal>
                    <SectionHeading eyebrow="Our Story" title="One service. Every detail.">
                        <p>
                            AIMILLE VOYAGES is a Kenya-based travel and lifestyle concierge,
                            created to make discovering and experiencing Kenya more
                            personal, comfortable and effortless.
                        </p>

                        <p className="mt-5">
                            Travel often means juggling many separate arrangements:
                            somewhere to stay, a way to get around, the experiences worth
                            having, and the everyday details in between. We bring those
                            together through one personalised service, so our clients can
                            focus on the experience itself.
                        </p>
                    </SectionHeading>
                </Reveal>

                <Reveal delay={150}>
                    <div className="relative">
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <Image
                                src={culture}
                                alt="Hands crafting traditional Kenyan beadwork"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                            />
                        </div>

                        <div className="pointer-events-none absolute -bottom-5 -left-5 -z-10 hidden h-32 w-32 border border-gold/60 md:block" />
                    </div>
                </Reveal>
            </section>

            {/* Mission and Vision */}
            <section className="bg-secondary/60 py-20 md:py-28">
                <div className="container-x grid gap-12 md:grid-cols-2 md:gap-16">
                    <Reveal>
                        <div className="border-l-2 border-gold pl-6 md:pl-8">
                            <p className="eyebrow text-gold-readable">Our Mission</p>

                            <p className="mt-5 font-serif text-3xl leading-snug text-primary md:text-4xl">
                                To simplify travel and everyday experiences through thoughtful
                                planning, personalised service and reliable coordination.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={150}>
                        <div className="border-l-2 border-gold pl-6 md:pl-8">
                            <p className="eyebrow text-gold-readable">Our Vision</p>

                            <p className="mt-5 font-serif text-3xl leading-snug text-primary md:text-4xl">
                                To become a trusted travel and lifestyle concierge connecting
                                people to exceptional experiences in Kenya and beyond.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Our Values */}
            <section className="container-x py-20 md:py-28">
                <Reveal>
                    <SectionHeading eyebrow="Our Values" title="What guides us.">
                        The principles behind every experience we plan and every
                        relationship we build.
                    </SectionHeading>
                </Reveal>

                <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {VALUES.map((value, index) => (
                        <Reveal key={value} delay={index * 60}>
                            <li className="group flex min-h-20 items-center justify-between gap-4 border border-gold/40 px-5 py-5 transition-all duration-300 hover:border-gold hover:bg-secondary/40 sm:px-6">
                <span className="font-serif text-xl text-primary transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                  {value}
                </span>

                                <span
                                    className="text-sm text-gold-readable"
                                    aria-hidden="true"
                                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                            </li>
                        </Reveal>
                    ))}
                </ul>
            </section>

            {/* What Makes Us Different */}
            <section className="relative overflow-hidden bg-band py-24 text-band-foreground md:py-32">
                <div className="container-x relative max-w-3xl">
                    <Reveal>
                        <p className="eyebrow text-gold-readable">What makes us different</p>

                        <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
                            One concierge partner, from arrival to departure.
                        </h2>

                        <p className="mt-7 max-w-2xl leading-relaxed text-ivory/80">
                            Instead of coordinating separate providers yourself, you have
                            one point of contact who understands your whole plan:
                            accommodation, transfers, excursions, travel planning and
                            extended-stay assistance. We keep the pieces working together
                            as your plans evolve.
                        </p>

                        <Link
                            href="/plan-your-trip"
                            className={cn(
                                buttonVariants({ variant: "gold", size: "xl" }),
                                "mt-10 w-full sm:w-auto",
                            )}
                        >
                            Let us plan your experience
                            <span aria-hidden="true" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
                        </Link>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
