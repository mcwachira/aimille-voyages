
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { NAV, waMsg } from "@/content/site";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppLink } from "./WhatsAppLink";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    const pathname = usePathname();
    const overHero = pathname === "/" && !scrolled;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu after navigation.
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close menu with Escape and prevent background scrolling.
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const navLinkClass = (href: string) =>
        cn(
            "relative whitespace-nowrap py-2 text-[0.7rem] font-medium uppercase tracking-[0.13em]",
            "transition-colors duration-200 hover:text-gold",
            overHero
                ? "text-ivory [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]"
                : "text-primary",
            isActive(href) && "text-gold",
        );

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50",
                    "transition-all duration-300",
                    overHero
                        ? "nav-scrim"
                        : "border-b border-border bg-background/95 shadow-sm backdrop-blur-xl",
                )}
            >
                <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-6">

                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="AIMILLE VOYAGES home"
                        className="shrink-0"
                    >
                        <Logo light={overHero} />
                    </Link>

                    {/* Desktop navigation */}
                    <nav
                        aria-label="Main navigation"
                        className="hidden 2xl:flex flex-1 items-center justify-center gap-5 2xl:gap-7"
                    >
                        {NAV.slice(1).map((item) => (
                            <Link
                                key={item.to}
                                href={item.to}
                                aria-current={isActive(item.to) ? "page" : undefined}
                                className={navLinkClass(item.to)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden shrink-0 items-center gap-2 2xl:flex">
                        <ThemeToggle
                            className={overHero ? "text-ivory" : "text-primary"}
                        />

                        <WhatsAppLink
                            location="header"
                            message={waMsg("planning a trip")}
                            className={cn(
                                "whitespace-nowrap px-2 text-[0.7rem] font-medium uppercase tracking-[0.12em]",
                                "transition-colors hover:text-gold",
                                overHero
                                    ? "text-ivory [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]"
                                    : "text-primary",
                            )}
                        >
                            WhatsApp
                        </WhatsAppLink>

                        <Link
                            href="/plan-your-trip"
                            className={buttonVariants({
                                variant: overHero ? "gold" : "brand",
                                size: "lg",
                            })}
                        >
                            Plan Your Trip
                        </Link>
                    </div>

                    {/* Compact actions for mobile, tablet and laptop */}
                    <div
                        className={cn(
                            "flex shrink-0 items-center gap-1 2xl:hidden",
                            overHero ? "text-ivory" : "text-primary",
                        )}
                    >
                        <Link
                            href="/plan-your-trip"
                            className={cn(
                                buttonVariants({
                                    variant: overHero ? "gold" : "brand",
                                    size: "sm",
                                }),
                                "h-9 px-2.5 text-[0.65rem] tracking-wider sm:h-10 sm:px-4 sm:text-xs",
                            )}
                        >
                            <span className="sm:hidden">Plan</span>
                            <span className="hidden sm:inline">Plan Your Trip</span>
                        </Link>

                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label="Open navigation menu"
                            aria-expanded={open}
                            aria-controls="mobile-navigation"
                            className="rounded-md p-2 transition-colors hover:bg-foreground/10 hover:text-gold"
                        >
                            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Full-screen mobile and tablet navigation */}
            {open && (
                <div
                    id="mobile-navigation"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                    className={cn(
                        "fixed inset-0 z-[60] overflow-y-auto",
                        "bg-band text-band-foreground",
                        "animate-in fade-in duration-200",
                        "2xl:hidden",
                    )}
                >
                    <div className="container-x flex min-h-16 items-center justify-between sm:min-h-20">
                        <Link
                            href="/"
                            aria-label="AIMILLE VOYAGES home"
                            onClick={() => setOpen(false)}
                        >
                            <Logo light />
                        </Link>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close navigation menu"
                            className="rounded-md p-2 transition-colors hover:bg-white/10 hover:text-gold"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="container-x mx-auto max-w-4xl pb-10">
                        <nav
                            aria-label="Mobile navigation links"
                            className="mt-5 flex flex-col sm:mt-8"
                        >
                            {NAV.map((item, index) => (
                                <Link
                                    key={item.to}
                                    href={item.to}
                                    onClick={() => setOpen(false)}
                                    aria-current={isActive(item.to) ? "page" : undefined}
                                    className={cn(
                                        "flex items-center justify-between",
                                        "border-b border-ivory/15",
                                        "py-3.5 font-serif text-2xl sm:py-5 sm:text-3xl md:text-4xl",
                                        "transition-colors hover:pl-2 hover:text-gold",
                                        isActive(item.to) && "text-gold",
                                    )}
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs font-sans tracking-widest text-ivory/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/plan-your-trip"
                                onClick={() => setOpen(false)}
                                className={buttonVariants({
                                    variant: "gold",
                                    size: "xl",
                                    className: "w-full",
                                })}
                            >
                                Plan Your Trip
                            </Link>

                            <WhatsAppLink
                                location="mobile_menu"
                                variant="ghostLight"
                                message={waMsg("planning a trip")}
                                className="w-full"
                            >
                                WhatsApp Us
                            </WhatsAppLink>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
