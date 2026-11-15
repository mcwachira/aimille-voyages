import type { Metadata } from "next";

import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = {
    title: "Cookie Policy | AIMILLE VOYAGES",
    description:
        "How AIMILLE VOYAGES uses cookies and similar technologies on this website.",
    alternates: {
        canonical: "/cookies",
    },
    openGraph: {
        title: "Cookie Policy | AIMILLE VOYAGES",
        description:
            "How this website uses cookies and similar technologies.",
        url: "/cookies",
        type: "website",
    },
};

export default function CookiesPage() {
    return (
        <LegalPage title="Cookie Policy">
            <p>
                This website uses essential technologies needed for it to function.
            </p>

            <h2>Analytics</h2>

            <p>
                If analytics is enabled, we may use Google Analytics to understand how
                visitors use the site, such as which pages are viewed and when
                enquiries are sent. This helps us improve the website.
            </p>

            <h2>Managing cookies</h2>

            <p>
                You can control or delete cookies through your browser settings.
            </p>
        </LegalPage>
    );
}