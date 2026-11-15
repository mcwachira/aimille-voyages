
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getService, SERVICES } from "@/content/services";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { ServiceViewTracker } from "@/components/site/ServiceViewTracker";

type ServicePageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return SERVICES
        .filter((service) => service.slug !== "long-stay")
        .map((service) => ({
            slug: service.slug,
        }));
}

export async function generateMetadata({
                                           params,
                                       }: ServicePageProps): Promise<Metadata> {
    const { slug } = await params;

    if (slug === "long-stay") {
        redirect("/long-stay");
    }

    const service = getService(slug);

    if (!service) {
        notFound();
    }

    const title = `${service.title} in Kenya | AIMILLE VOYAGES`;
    const description = service.short;

    return {
        title,
        description,
        alternates: {
            canonical: `/services/${service.slug}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
        },
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug } = await params;

    if (slug === "long-stay") {
        redirect("/long-stay");
    }

    const service = getService(slug);

    if (!service) {
        notFound();
    }

    return (
        <>
            <ServiceViewTracker slug={service.slug} />
            <ServiceDetail s={service} />
        </>
    );
}
