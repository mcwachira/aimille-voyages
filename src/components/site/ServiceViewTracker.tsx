
"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type ServiceViewTrackerProps = {
    slug: string;
};

export function ServiceViewTracker({ slug }: ServiceViewTrackerProps) {
    useEffect(() => {
        track("service_view", { service: slug });
    }, [slug]);

    return null;
}
