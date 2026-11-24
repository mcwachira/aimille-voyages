
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { SanityDestinationCard } from "@/sanity/types";
import type { Destination } from "@/content/destinations";
import type { Service } from "@/content/services";

import { serviceHref } from "@/content/services";
import { sanityImageUrl } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

export function DestinationCard({
                                    d,
                                    tall,
                                }: {
    d: Destination | SanityDestinationCard;
    tall?: boolean;
}) {
    const image =
        "_id" in d
            ? sanityImageUrl(d.image, "/images/destination-placeholder.jpg")
            : d.image;

    return (
        <Link
            href={`/destinations/${d.slug}`}
            className={cn(
                "group relative block overflow-hidden bg-band",
                tall ? "aspect-[3/4]" : "aspect-[4/5]",
            )}
        >
            <Image
                src={image}
                alt={`${d.name}, ${d.country}`}
                fill
                sizes={
                    tall
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                }
                className="img-zoom object-cover group-hover:scale-105"
            />

            <div className="absolute inset-0 card-overlay" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <p className="eyebrow text-gold">{d.region}</p>

                <h3 className="mt-2 text-3xl md:text-4xl">{d.name}</h3>

                <p className="mt-2 line-clamp-2 text-sm text-ivory/80">
                    {d.summary}
                </p>

                <span className="eyebrow mt-4 inline-flex items-center gap-2 text-ivory">
                    Explore destination
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </div>
        </Link>
    );
}

export function ServiceCard({
                                s,
                                index,
                            }: {
    s: Service;
    index: number;
}) {
    return (
        <Link href={serviceHref(s)} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="img-zoom object-cover group-hover:scale-105"
                />
            </div>

            <p className="eyebrow mt-6 text-gold">0{index + 1}</p>

            <h3 className="mt-2 text-3xl text-primary">{s.title}</h3>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.short}
            </p>

            <span className="eyebrow mt-4 inline-flex items-center gap-2 border-b border-gold pb-1 text-primary">
                Discover more
                <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
        </Link>
    );
}
