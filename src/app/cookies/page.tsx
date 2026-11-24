
import type { Metadata } from "next";

import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = {
    title: "Cookie Policy | AIMILLE VOYAGES",
    description:
        "Understand how AIMILLE VOYAGES uses cookies and similar technologies on its website and how you can manage your preferences.",
    alternates: {
        canonical: "/cookies",
    },
    openGraph: {
        title: "Cookie Policy | AIMILLE VOYAGES",
        description:
            "How AIMILLE VOYAGES uses cookies and similar technologies and how visitors can manage them.",
        url: "/cookies",
        type: "website",
    },
};

export default function CookiesPage() {
    return (
        <LegalPage
            title="Cookie Policy"
            description="An explanation of cookies and similar technologies that may be used to support your browsing experience on the AIMILLE VOYAGES website."
        >
            <p>
                <strong>Policy status:</strong> This is a draft policy
                pending verification of the website&apos;s active cookies,
                analytics configuration and final business review.
            </p>

            <h2>1. What are cookies?</h2>

            <p>
                Cookies are small text files that websites may store
                on your device when you visit them. They help websites
                remember information about your visit, maintain certain
                functionality and understand how visitors interact
                with their pages.
            </p>

            <p>
                Similar technologies, such as local storage, session
                storage and tracking pixels, may also be used for
                related purposes.
            </p>

            <h2>2. Why we use cookies</h2>

            <p>
                AIMILLE VOYAGES may use cookies and similar technologies
                for the following purposes:
            </p>

            <h3>Essential functionality</h3>

            <p>
                These technologies support features necessary for
                the website to operate properly, maintain functionality
                and protect against misuse. They cannot always be
                disabled without affecting how the website works.
            </p>

            <h3>Preferences</h3>

            <p>
                Where implemented, these technologies may remember
                choices such as website preferences so that your
                experience is more consistent when you return.
            </p>

            <h3>Analytics and performance</h3>

            <p>
                If analytics tools are enabled, they may help us
                understand how visitors use the website, which pages
                receive attention, how visitors navigate the site
                and whether particular website features are working
                as expected.
            </p>

            <p>
                This information helps us evaluate website performance
                and improve the experience we provide.
            </p>

            <h3>Marketing and third-party technologies</h3>

            <p>
                If introduced in the future, marketing or advertising
                technologies may be used to measure campaigns or
                understand interactions with promotional content.
                Such technologies should only be activated in
                accordance with applicable consent requirements.
            </p>

            <h2>3. Third-party services</h2>

            <p>
                Certain website features may rely on third-party
                services, such as analytics, embedded content or
                external service integrations. These providers may
                use their own cookies or similar technologies.
            </p>

            <p>
                Third-party services operate under their respective
                privacy and cookie policies. We encourage you to
                review those policies when interacting with their
                services.
            </p>

            <h2>4. Managing cookies</h2>

            <p>
                You can manage, restrict or delete cookies through
                the settings available in your web browser.
                Most browsers allow you to view stored cookies,
                remove existing cookies and block some or all
                future cookies.
            </p>

            <p>
                Please be aware that disabling certain cookies
                may affect website functionality or prevent
                some features from working as intended.
            </p>

            <h2>5. Consent and your choices</h2>

            <p>
                Where applicable, non-essential cookies and
                similar technologies should only be used
                after the required consent has been obtained.
                You should be able to make an informed choice
                about their use.
            </p>

            <p>
                If we introduce a cookie preference or consent
                management feature, this policy will be updated
                to explain how you can review or change your
                choices.
            </p>

            <h2>6. Changes to this policy</h2>

            <p>
                We may update this Cookie Policy as our website,
                technology providers and legal obligations change.
                Any revised version will be published on this page.
            </p>

            <h2>7. Contact us</h2>

            <p>
                If you have questions about this Cookie Policy
                or how cookies are used on our website, please
                contact AIMILLE VOYAGES through our website&apos;s
                contact page.
            </p>
        </LegalPage>
    );
}
