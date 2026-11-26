export function getTrustedAppOrigin(): string {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!configuredUrl) {
        throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable.");
    }

    const parsedUrl = new URL(configuredUrl);
    const isLocalHttp =
        parsedUrl.protocol === "http:" &&
        ["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname);
    const localHttpAllowed = process.env.NODE_ENV !== "production";

    if (
        (parsedUrl.protocol !== "https:" && !(isLocalHttp && localHttpAllowed)) ||
        parsedUrl.username ||
        parsedUrl.password
    ) {
        throw new Error(
            "NEXT_PUBLIC_SITE_URL must be HTTPS, or HTTP on localhost during development.",
        );
    }

    return parsedUrl.origin;
}
