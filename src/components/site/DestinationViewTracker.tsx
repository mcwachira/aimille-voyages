
"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function DestinationViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        track("destination_view", { destination: slug });
    }, [slug]);

    return null;
}
