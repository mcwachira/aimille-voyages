
import Image, {type StaticImageData} from "next/image";
import type { ReactNode } from "react";

export function PageHero({
                             image,
                             eyebrow,
                             title,
                             children,
                             alt,
                         }: {
    image: StaticImageData | string;
    eyebrow?: string;
    title: ReactNode;
    children?: ReactNode;
    alt: string;
}) {
    return (
        <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-band">
            <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 object-cover animate-slow-zoom"
            />

            <div className="absolute inset-0 hero-overlay" />

            <div className="container-x relative pb-16 pt-36 text-ivory md:pb-24">
                {eyebrow && (
                    <p className="eyebrow text-gold">{eyebrow}</p>
                )}

                <h1 className="mt-5 max-w-4xl text-5xl md:text-7xl">
                    {title}
                </h1>

                {children && (
                    <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">
                        {children}
                    </div>
                )}
            </div>
        </section>
    );
}

export function SectionHeading({
                                   eyebrow,
                                   title,
                                   children,
                                   center,
                               }: {
    eyebrow?: string;
    title: ReactNode;
    children?: ReactNode;
    center?: boolean;
}) {
    return (
        <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
            {eyebrow && (
                <p
                    className={`eyebrow flex items-center gap-4 text-gold ${
                        center ? "justify-center" : ""
                    }`}
                >
                    <span className="gold-rule" />
                    {eyebrow}
                </p>
            )}

            <h2 className="mt-5 text-4xl text-primary md:text-6xl">
                {title}
            </h2>

            {children && (
                <div className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {children}
                </div>
            )}
        </div>
    );
}
