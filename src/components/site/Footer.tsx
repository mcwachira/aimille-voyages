
import Link from "next/link";

import { NAV, SITE } from "@/content/site";
import { SERVICES, serviceHref } from "@/content/services";
import { DESTINATIONS } from "@/content/destinations";

import { Logo } from "./Logo";
import { WhatsAppLink } from "./WhatsAppLink";
import { TrackedAnchor } from "./TrackedAnchor";

export function Footer() {
    return (
        <footer className="bg-band text-band-foreground">
            <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-5">

                {/* Brand */}
                <div className="max-w-sm lg:col-span-2">
                    <Logo light />

                    <p className="eyebrow mt-6 text-gold-readable">
                        {SITE.descriptor}
                    </p>

                    <p className="mt-4 font-serif text-2xl italic">
                        {SITE.tagline}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                        A Kenya-based travel and lifestyle concierge coordinating
                        holidays, stays, transport, experiences and extended-stay
                        support. {SITE.supporting}
                    </p>
                </div>

                {/* Explore */}
                <FooterCol title="Explore">
                    {NAV.map((item) => (
                        <Link
                            key={item.to}
                            href={item.to}
                            className="transition-colors hover:text-gold-readable"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <Link
                        href="/plan-your-trip"
                        className="transition-colors hover:text-gold-readable"
                    >
                        Plan Your Trip
                    </Link>
                    <Link href="/packages" className="transition-colors hover:text-gold-readable">Travel Packages</Link>
                    <Link href="/articles" className="transition-colors hover:text-gold-readable">Travel Stories</Link>
                    <Link href="/guides" className="transition-colors hover:text-gold-readable">Travel Guides</Link>
                </FooterCol>

                {/* Services */}
                <FooterCol title="Services">
                    {SERVICES.map((service) => (
                        <Link
                            key={service.slug}
                            href={serviceHref(service)}
                            className="transition-colors hover:text-gold-readable"
                        >
                            {service.title}
                        </Link>
                    ))}
                </FooterCol>

                {/* Destinations */}
                <FooterCol title="Destinations">
                    {DESTINATIONS.map((destination) => (
                        <Link
                            key={destination.slug}
                            href={`/destinations/${destination.slug}`}
                            className="transition-colors hover:text-gold-readable"
                        >
                            {destination.name}
                        </Link>
                    ))}
                </FooterCol>
            </div>

            {/* Contact details */}
            <div className="container-x grid gap-6 border-t border-ivory/15 py-10 text-sm md:grid-cols-4">

                <WhatsAppLink
                    location="footer"
                    message={undefined}
                    className="transition-colors hover:text-gold-readable"
                >
          <span className="mb-1 block eyebrow text-gold-readable">
            WhatsApp
          </span>
                    {SITE.whatsappDisplay}
                </WhatsAppLink>

                <TrackedAnchor
                    href={`mailto:${SITE.email}`}
                    event="email_click"
                    location="footer"
                    className="break-all transition-colors hover:text-gold-readable"
                >
          <span className="mb-1 block eyebrow text-gold-readable">
            Email
          </span>
                    {SITE.email}
                </TrackedAnchor>

                <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold-readable"
                >
          <span className="mb-1 block eyebrow text-gold-readable">
            Instagram
          </span>
                    {SITE.handle}
                </a>

                <a
                    href={SITE.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold-readable"
                >
          <span className="mb-1 block eyebrow text-gold-readable">
            TikTok
          </span>
                    {SITE.handle}
                </a>
            </div>

            {/* Legal links */}
            <div className="container-x flex flex-col gap-3 border-t border-ivory/15 py-6 text-xs text-ivory/60 md:flex-row md:justify-between">
                <p>
                    © {new Date().getFullYear()} AIMILLE VOYAGES. All rights reserved.
                </p>

                <div className="flex flex-wrap gap-5">
                    <Link href="/privacy" className="hover:text-gold-readable">
                        Privacy Policy
                    </Link>

                    <Link href="/cookies" className="hover:text-gold-readable">
                        Cookie Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({
                       title,
                       children,
                   }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="eyebrow text-gold-readable">{title}</p>

            <div className="mt-5 flex flex-col gap-2.5 text-sm text-ivory/80">
                {children}
            </div>
        </div>
    );
}
