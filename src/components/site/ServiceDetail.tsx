
import type { ReactNode } from "react";

import type { Service } from "@/content/services";
import { PageHero } from "./PageHero";
import { EnquiryForm } from "./EnquiryForm";
import { WhatsAppLink } from "./WhatsAppLink";
import { waMsg, SUPPLIER_NOTE } from "@/content/site";
import { FORMS } from "@/content/forms";

type ServiceDetailProps = {
    s: Service;
    title?: ReactNode;
    extra?: ReactNode;
};

export function ServiceDetail({
                                  s,
                                  title,
                                  extra,
                              }: ServiceDetailProps) {
    return (
        <>
            <PageHero
                image={s.image}
                alt={s.title}
                eyebrow={s.title}
                title={title ?? s.title}
            >
                {s.intro}
            </PageHero>

            <section className="container-x grid gap-16 py-24 lg:grid-cols-[1fr_1.1fr]">
                <div>
                    <p className="eyebrow text-gold">What we cover</p>

                    <ul className="mt-6 divide-y divide-border border-y border-border">
                        {s.covers.map((item) => (
                            <li
                                key={item}
                                className="py-4 font-serif text-2xl text-primary"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>

                    <p className="eyebrow mt-12 text-gold">Why it helps</p>

                    <ul className="mt-4 space-y-3">
                        {s.benefits.map((benefit) => (
                            <li
                                key={benefit}
                                className="flex gap-3 text-muted-foreground"
                            >
                                <span className="mt-3 h-px w-5 shrink-0 bg-gold" />
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
                        {SUPPLIER_NOTE}
                    </p>

                    <WhatsAppLink
                        location={`service_${s.slug}`}
                        variant="line"
                        className="mt-8"
                        message={waMsg(s.whatsapp)}
                    >
                        Ask on WhatsApp
                    </WhatsAppLink>
                </div>

                <div
                    id="enquire"
                    className="scroll-mt-28 border border-border bg-card p-6 md:p-10"
                >
                    {extra}

                    <p className="eyebrow text-gold">{FORMS[s.form].title}</p>

                    <h2 className="mb-8 mt-3 text-4xl text-primary">
                        {s.cta}
                    </h2>

                    <EnquiryForm
                        category={s.form}
                        sourcePage={`/services/${s.slug}`}
                        whatsappTopic={s.whatsapp}
                    />
                </div>
            </section>
        </>
    );
}
