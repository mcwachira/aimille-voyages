
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

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close the mobile menu when navigating.
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close the mobile menu using Escape.
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
                overHero
                    ? "nav-scrim"
                    : "border-b border-border bg-background/95 shadow-sm backdrop-blur-md",
            )}
        >
            <div className="container-x flex h-20 items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/" aria-label="AIMILLE VOYAGES home">
                    <Logo light={overHero} />
                </Link>

                {/* Desktop navigation */}
                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-5 xl:flex 2xl:gap-7"
                >
                    {NAV.slice(1).map((item) => (
                        <Link
                            key={item.to}
                            href={item.to}
                            aria-current={isActive(item.to) ? "page" : undefined}
                            className={cn(
                                "whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors hover:text-gold",
                                overHero
                                    ? "text-ivory [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]"
                                    : "text-primary",
                                isActive(item.to) && "!text-gold",
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 xl:flex">
                    <ThemeToggle
                        className={overHero ? "text-ivory" : "text-primary"}
                    />

                    <WhatsAppLink
                        location="header"
                        message={waMsg("planning a trip")}
                        className={cn(
                            "whitespace-nowrap px-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] hover:text-gold",
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

                {/* Mobile actions */}
                <div
                    className={cn(
                        "flex items-center gap-1 xl:hidden",
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
                            "h-10 px-3 tracking-[0.14em] sm:px-4",
                        )}
                    >
                        <span className="sm:hidden">Plan trip</span>
                        <span className="hidden sm:inline">Plan Your Trip</span>
                    </Link>

                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Open navigation menu"
                        aria-expanded={open}
                        aria-controls="mobile-navigation"
                        className="rounded-sm p-2 transition-colors hover:text-gold"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile navigation overlay */}
            {open && (
                <div
                    id="mobile-navigation"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                    className="fixed inset-0 z-50 overflow-y-auto bg-band text-band-foreground animate-in fade-in duration-300 xl:hidden"
                >
                    <div className="container-x flex h-20 items-center justify-between">
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
                            className="rounded-sm p-2 transition-colors hover:text-gold"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav
                        aria-label="Mobile navigation links"
                        className="container-x mt-6 flex flex-col"
                    >
                        {NAV.map((item) => (
                            <Link
                                key={item.to}
                                href={item.to}
                                onClick={() => setOpen(false)}
                                aria-current={isActive(item.to) ? "page" : undefined}
                                className={cn(
                                    "border-b border-ivory/15 py-4 font-serif text-3xl transition-colors hover:text-gold",
                                    isActive(item.to) && "text-gold",
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="container-x mt-8 flex flex-col gap-3">
                        <Link
                            href="/plan-your-trip"
                            onClick={() => setOpen(false)}
                            className={buttonVariants({
                                variant: "gold",
                                size: "xl",
                            })}
                        >
                            Plan Your Trip
                        </Link>

                        <WhatsAppLink
                            location="mobile_menu"
                            variant="ghostLight"
                            message={waMsg("planning a trip")}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
