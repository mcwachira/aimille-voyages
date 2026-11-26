import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PublicSiteChrome } from "./PublicSiteChrome";

const navigation = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
    usePathname: () => navigation.pathname,
}));

describe("PublicSiteChrome", () => {
    beforeEach(() => {
        navigation.pathname = "/";
    });

    it("keeps the public header, flexible main content, and footer in document order", () => {
        const markup = renderToStaticMarkup(
            <PublicSiteChrome
                header={<header>Public navigation</header>}
                footer={<footer>Public footer</footer>}
            >
                <article>Page content</article>
            </PublicSiteChrome>,
        );

        expect(markup.indexOf("<header")).toBeLessThan(markup.indexOf("<main"));
        expect(markup.indexOf("<main")).toBeLessThan(markup.indexOf("<footer"));
        expect(markup).toContain("class=\"flex-1\"");
    });

    it("keeps dashboard content while excluding public navigation and footer", () => {
        navigation.pathname = "/dashboard/reset-password";

        const markup = renderToStaticMarkup(
            <PublicSiteChrome
                header={<header>Public navigation</header>}
                footer={<footer>Public footer</footer>}
            >
                <article>Dashboard page</article>
            </PublicSiteChrome>,
        );

        expect(markup).toContain("Dashboard page");
        expect(markup).not.toContain("Public navigation");
        expect(markup).not.toContain("Public footer");
        expect(markup).toContain("<main");
    });

    it("keeps the fragment auth callback outside the public site chrome", () => {
        navigation.pathname = "/auth/callback/fragment";

        const markup = renderToStaticMarkup(
            <PublicSiteChrome
                header={<header>Public navigation</header>}
                footer={<footer>Public footer</footer>}
            >
                <article>Authentication callback</article>
            </PublicSiteChrome>,
        );

        expect(markup).toContain("Authentication callback");
        expect(markup).not.toContain("Public navigation");
        expect(markup).not.toContain("Public footer");
    });
});
