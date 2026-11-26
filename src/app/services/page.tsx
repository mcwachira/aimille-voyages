
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import transport from "@/assets/transport.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { SERVICES, serviceHref } from "@/content/services";
import { FinalCta } from "@/components/site/FinalCta";

export const metadata: Metadata = {
    title: "Travel & Concierge Services in Kenya | AIMILLE VOYAGES",
    description:
        "Bespoke holidays, accommodation, airport transfers, curated experiences, long-stay concierge and corporate travel coordination in Kenya.",
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: "Travel & Concierge Services in Kenya | AIMILLE VOYAGES",
        description:
            "Bespoke holidays, accommodation, airport transfers, curated experiences, long-stay concierge and corporate travel coordination in Kenya.",
        type: "website",
    },
};

export default function ServicesPage() {
    return (
        <>
            <PageHero
                image={transport}
                alt="Chauffeur opening the door of a private car for a guest at a Nairobi airport"
                eyebrow="Services"
                title="Six ways we take care of the details."
            />

            <div className="container-x space-y-24 py-24 md:space-y-36 md:py-32">
                {SERVICES.map((service, index) => (
                    <Reveal
                        key={service.slug}
                        className={`grid gap-10 md:grid-cols-2 md:items-center ${
                            index % 2 ? "md:[&>*:first-child]:order-2" : ""
                        }`}
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                sizes="(max-width: 767px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                            />
                        </div>

                        <div>
                            <p className="eyebrow text-gold-readable">
                                {String(index + 1).padStart(2, "0")}
                            </p>

                            <h2 className="mt-3 text-4xl text-primary md:text-5xl">
                                {service.title}
                            </h2>

                            <p className="mt-5 leading-relaxed text-muted-foreground">
                                {service.intro}
                            </p>

                            <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                                {service.covers.slice(0, 6).map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={serviceHref(service)}
                                className={`${buttonVariants({
                                    variant: "brand",
                                    size: "xl",
                                })} mt-8`}
                            >
                                {service.cta}
                            </Link>
                        </div>
                    </Reveal>
                ))}
            </div>

            <FinalCta />
        </>
    );
}
