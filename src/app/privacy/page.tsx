
import type { Metadata } from "next";

import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
    title: "Privacy Policy | AIMILLE VOYAGES",
    description:
        "Learn how AIMILLE VOYAGES collects, uses, stores and protects personal information shared through its website and travel services.",
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy | AIMILLE VOYAGES",
        description:
            "How AIMILLE VOYAGES handles personal information and protects your privacy.",
        url: "/privacy",
        type: "website",
    },
};

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            description="Your privacy matters to us. This policy explains how AIMILLE VOYAGES handles personal information when you explore our website, submit an enquiry or request travel and concierge services."
        >
            <p>
                <strong>Policy status:</strong> This is a draft privacy policy
                pending final business and legal review. It should be read
                together with any relevant terms and notices provided when
                you use our services.
            </p>

            <h2>1. About this policy</h2>

            <p>
                AIMILLE VOYAGES (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;) is a travel and lifestyle
                concierge service based in Kenya. We respect your privacy and
                are committed to handling personal information responsibly.
            </p>

            <p>
                This policy applies to personal information collected through
                our website, enquiry forms, communications and the travel or
                concierge services we provide.
            </p>

            <h2>2. Information we collect</h2>

            <p>
                The information we collect depends on the services you request
                and the information you choose to share with us. It may include:
            </p>

            <ul>
                <li>
                    <strong>Identity and contact details:</strong> your name,
                    email address, telephone number, WhatsApp number and
                    company or organisation.
                </li>
                <li>
                    <strong>Travel information:</strong> destinations,
                    arrival and departure dates, number of travellers,
                    accommodation preferences and transport requirements.
                </li>
                <li>
                    <strong>Enquiry details:</strong> your budget, preferred
                    experiences, requested services, special requirements
                    and other information you include in a message.
                </li>
                <li>
                    <strong>Communication records:</strong> correspondence
                    and information exchanged when discussing an enquiry
                    or coordinating requested arrangements.
                </li>
                <li>
                    <strong>Technical information:</strong> information such
                    as browser type, device information, website usage and
                    approximate location that may be collected through
                    website technologies and analytics.
                </li>
            </ul>

            <p>
                Please avoid submitting sensitive personal information unless
                it is necessary for your request and we have an appropriate
                reason to collect it.
            </p>

            <h2>3. How we use your information</h2>

            <p>
                We may use the information you provide to:
            </p>

            <ul>
                <li>Respond to enquiries and requests for information.</li>
                <li>Prepare personalised travel proposals and itineraries.</li>
                <li>
                    Coordinate accommodation, transport, experiences and
                    other requested travel arrangements.
                </li>
                <li>
                    Communicate with you about your enquiry, arrangements
                    and service updates.
                </li>
                <li>
                    Maintain customer, enquiry and booking records.
                </li>
                <li>
                    Improve our website, services and customer experience.
                </li>
                <li>
                    Protect our website and business against misuse,
                    fraudulent activity and security threats.
                </li>
                <li>
                    Meet applicable legal, regulatory and administrative
                    obligations.
                </li>
            </ul>

            <h2>4. Sharing your information</h2>

            <p>
                We do not sell your personal information. We may share
                relevant information with third parties where necessary
                to respond to your request or provide the services you
                have requested.
            </p>

            <p>These parties may include:</p>

            <ul>
                <li>
                    Hotels, accommodation providers and property managers.
                </li>
                <li>
                    Airlines, transport operators, drivers and transfer
                    providers.
                </li>
                <li>
                    Tour operators, guides, experience providers and
                    other travel suppliers.
                </li>
                <li>
                    Technology and service providers that support our
                    website, communications, data storage and operations.
                </li>
                <li>
                    Professional advisers, regulators or public authorities
                    where disclosure is required or permitted by law.
                </li>
            </ul>

            <p>
                We aim to share only the information reasonably necessary
                for the relevant purpose. Third-party providers may handle
                information under their own privacy policies and applicable
                obligations.
            </p>

            <h2>5. Website technology and analytics</h2>

            <p>
                Our website may use cookies and similar technologies to
                support essential website functionality, remember
                preferences, understand website usage and improve
                performance.
            </p>

            <p>
                Some technologies may be provided by third-party services.
                Their use may involve collecting technical information
                about your device or interaction with our website.
            </p>

            <p>
                Please refer to our Cookie Policy for further information
                about cookies and how you can manage them.
            </p>

            <h2>6. Data storage and security</h2>

            <p>
                We use digital systems and service providers to manage
                enquiries and support our business operations. We take
                reasonable measures intended to protect personal
                information against unauthorised access, loss, misuse,
                alteration or disclosure.
            </p>

            <p>
                Access to personal information should be limited to
                authorised individuals and service providers who need
                it for legitimate business purposes.
            </p>

            <p>
                No website, electronic transmission or storage system
                can be guaranteed to be completely secure. We therefore
                cannot promise absolute security.
            </p>

            <h2>7. International transfers</h2>

            <p>
                Some of the technology and travel providers we use may
                process or store information outside Kenya. Where personal
                information is transferred internationally, we will take
                appropriate steps to ensure that the transfer is handled
                in accordance with applicable data protection requirements.
            </p>

            <h2>8. How long we keep information</h2>

            <p>
                We retain personal information only for as long as
                reasonably necessary for the purposes described in
                this policy, including responding to enquiries,
                coordinating services, maintaining relevant business
                records and meeting legal obligations.
            </p>

            <p>
                Retention periods may vary depending on the nature
                of the information and the reason it was collected.
                Information that is no longer required should be
                securely deleted or anonymised where appropriate.
            </p>

            <h2>9. Your privacy rights</h2>

            <p>
                Subject to applicable law, you may have the right to:
            </p>

            <ul>
                <li>Request access to your personal information.</li>
                <li>Request correction of inaccurate or incomplete information.</li>
                <li>Request deletion of personal information where applicable.</li>
                <li>
                    Object to or request restriction of certain processing
                    activities where permitted by law.
                </li>
                <li>
                    Withdraw consent where processing is based on your consent.
                </li>
                <li>
                    Raise a concern about how your personal information
                    is handled.
                </li>
            </ul>

            <p>
                To exercise a privacy right or ask a question about your
                information, contact us using the details below. We may
                need to verify your identity before responding.
            </p>

            <h2>10. Children&apos;s information</h2>

            <p>
                Our website and services are not intended to encourage
                children to submit personal information independently.
                Where travel arrangements involve children, we expect
                the relevant information to be provided by a parent,
                guardian or other appropriately authorised adult.
            </p>

            <h2>11. Third-party websites</h2>

            <p>
                Our website may contain links to websites or services
                operated by third parties. We are not responsible for
                their privacy practices, content or security. We encourage
                you to review their privacy policies before sharing
                personal information with them.
            </p>

            <h2>12. Changes to this policy</h2>

            <p>
                We may update this policy when our services, business
                practices or legal obligations change. The updated
                version will be published on this page with a revised
                effective date where appropriate.
            </p>

            <h2>13. Contact us</h2>

            <p>
                If you have questions, concerns or requests relating
                to this Privacy Policy or the handling of your personal
                information, please contact AIMILLE VOYAGES:
            </p>

            <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>

            <p>
                <strong>Location:</strong> Kenya
            </p>
        </LegalPage>
    );
}
