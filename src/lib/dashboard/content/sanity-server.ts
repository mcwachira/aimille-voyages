import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

let cachedClient: ReturnType<typeof createClient> | undefined;

export function getDashboardSanityClient() {
    const token = process.env.SANITY_API_WRITE_TOKEN;

    if (!token) {
        throw new Error("Content editing is not configured. Set SANITY_API_WRITE_TOKEN on the server.");
    }

    cachedClient ??= createClient({
        projectId,
        dataset,
        apiVersion,
        token,
        useCdn: false,
        perspective: "raw",
    });

    return cachedClient;
}

export function hasDashboardSanityWriteAccess() {
    return Boolean(process.env.SANITY_API_WRITE_TOKEN);
}
