import type { Metadata } from "next";

import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
    title: "Privacy Policy | AIMILLE VOYAGES",
    description:
        "How AIMILLE VOYAGES collects and uses personal information shared through website enquiries.",
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy | AIMILLE VOYAGES",
        description:
            "How AIMILLE VOYAGES collects and uses personal information shared through enquiries.",
        url: "/privacy",
        type: "website",
    },
};

export default function PrivacyPage() {
    return (
        <LegalPage title="Privacy Policy">
            <p>
                This draft policy explains how AIMILLE VOYAGES handles personal
                information you share with us through this website.
            </p>

            <h2>Information we collect</h2>

            <p>
                When you send an enquiry we collect the details you provide, such as
                your name, email, phone or WhatsApp number, country, travel dates,
                number of travellers, preferences and any notes.
            </p>

            <h2>How we use it</h2>

            <p>
                We use this information to respond to your enquiry, plan and coordinate
                your requested arrangements, and communicate with you. Where
                arrangements involve third-party suppliers, relevant details may be
                shared with them only as needed to fulfil your request.
            </p>

            <h2>Storage and retention</h2>

            <p>
                Enquiries are stored securely and kept only as long as reasonably
                necessary for the purposes above.
            </p>

            <h2>Your choices</h2>

            <p>
                You may ask us to access, correct or delete your information by
                contacting {SITE.email}.
            </p>

            <h2>Contact</h2>

            <p>
                Questions about this policy can be sent to {SITE.email}.
            </p>
        </LegalPage>
    );
}