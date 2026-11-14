
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { cn } from "@/lib/utils";
import { GA_ID } from "@/lib/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://aimillevoyages.com",
  ),
  title: {
    default: "AIMILLE VOYAGES | Bespoke Travel & Concierge in Kenya",
    template: "%s | AIMILLE VOYAGES",
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
          className={cn(
              "h-full",
              "antialiased",
              geistSans.variable,
              geistMono.variable,
              jetbrainsMono.variable,
          )}
      >
      <body className="flex min-h-full flex-col font-sans">
      {children}

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
