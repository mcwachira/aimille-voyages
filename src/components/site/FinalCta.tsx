import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppLink } from "./WhatsAppLink";
import { waMsg } from "@/content/site";

export function FinalCta({
                             topic = "planning a trip",
                         }: {
    topic?: string;
}) {
    return (
        <section className="bg-band py-24 text-center text-band-foreground md:py-32">
            <div className="container-x">
                <span className="gold-rule mx-auto" />

                <h2 className="mx-auto mt-8 max-w-3xl text-5xl md:text-7xl">
                    Your Next Experience Starts Here.
                </h2>

                <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ivory/75">
                    Tell us what you have in mind. We&apos;ll help you explore the possibilities
                    and coordinate a journey that feels entirely yours.
                </p>

                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/plan-your-trip"
                        className={buttonVariants({ variant: "gold", size: "xl" })}
                    >
                        Plan your trip
                    </Link>

                    <WhatsAppLink
                        location="final_cta"
                        variant="ghostLight"
                        message={waMsg(topic)}
                    />
                </div>
            </div>
        </section>
    );
}
