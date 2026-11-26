
import type { Metadata, Viewport } from "next";
import {
    Cormorant_Garamond,
    DM_Sans,
    JetBrains_Mono,
} from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { cn } from "@/lib/utils";
import { GA_ID } from "@/lib/analytics";
import { Navbar } from "@/components/site/Navbar";
import { PublicSiteChrome } from "@/components/site/PublicSiteChrome";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Footer } from "@/components/site/Footer";
import { getPublicSiteOrigin } from "@/lib/site-origin";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
    variable: "--font-cormorant-garamond",
    subsets: ["latin"],
    display: "swap",
    style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(getPublicSiteOrigin()),
    title: {
        default: "AIMILLE VOYAGES | Bespoke Travel & Concierge in Kenya",
        template: "%s",
    },
    description:
        "Discover Kenya with AIMILLE VOYAGES. Explore bespoke holidays, luxury accommodation, private transfers, curated experiences and personalised concierge services.",
    applicationName: "AIMILLE VOYAGES",
    keywords: [
        "AIMILLE VOYAGES",
        "Kenya travel",
        "bespoke holidays Kenya",
        "Kenya safari holidays",
        "luxury travel Kenya",
        "Kenya accommodation",
        "private transfers Kenya",
        "travel concierge Kenya",
        "Diani Beach holidays",
        "Maasai Mara safaris",
    ],
    openGraph: {
        type: "website",
        locale: "en_KE",
        siteName: "AIMILLE VOYAGES",
        title: "AIMILLE VOYAGES | Bespoke Travel & Concierge in Kenya",
        description:
            "Thoughtfully planned holidays, stays, experiences and concierge services across Kenya.",
    },
    twitter: {
        card: "summary_large_image",
        title: "AIMILLE VOYAGES | Bespoke Travel & Concierge in Kenya",
        description:
            "Discover Kenya through personalised travel, curated experiences and concierge services.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#17251F",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "h-full",
                "antialiased",
                dmSans.variable,
                cormorantGaramond.variable,
                jetbrainsMono.variable,
            )}
        >
        <body className="flex min-h-screen min-h-[100dvh] flex-col font-sans">
        <a
            href="#main-content"
            className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-3 focus:text-foreground"
        >
            Skip to main content
        </a>
        <ThemeProvider>
            <PublicSiteChrome header={<Navbar />} footer={<Footer />}>
                {children}
            </PublicSiteChrome>
        </ThemeProvider>

        {GA_ID && (
            <>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"
                />

                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
                </Script>
            </>
        )}
        </body>
        </html>
    );
}
