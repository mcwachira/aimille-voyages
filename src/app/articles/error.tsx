"use client";

import { EditorialRouteError } from "@/components/site/EditorialRouteError";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <EditorialRouteError reset={reset} />;
}
