/**
 * Returns the configured public origin used for canonical metadata and crawler
 * files. Local HTTP is allowed for development builds; other origins must use
 * HTTPS. Authentication redirects apply the stricter production checks in
 * `trusted-origin.ts`.
 */
export function getPublicSiteOrigin(): string {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!configuredUrl) {
        throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable.");
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(configuredUrl);
    } catch {
        throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute website URL.");
    }

    const isLocalHttp =
        parsedUrl.protocol === "http:" &&
        ["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname);

    if (
        (parsedUrl.protocol !== "https:" && !isLocalHttp) ||
        parsedUrl.username ||
        parsedUrl.password
    ) {
        throw new Error(
            "NEXT_PUBLIC_SITE_URL must use HTTPS, or HTTP on localhost for development.",
        );
    }

    return parsedUrl.origin;
}
