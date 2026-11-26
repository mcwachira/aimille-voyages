export const PUBLIC_CONTENT_ROUTES = {
    packages: { path: "/packages", title: "Travel Packages" },
    articles: { path: "/articles", title: "Travel Stories" },
    guides: { path: "/guides", title: "Travel Guides" },
} as const;

export type PublicContentKind = keyof typeof PUBLIC_CONTENT_ROUTES;

export function editorialDetailPath(kind: PublicContentKind, slug: string) {
    return `${PUBLIC_CONTENT_ROUTES[kind].path}/${encodeURIComponent(slug)}`;
}
