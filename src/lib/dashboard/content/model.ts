import { PUBLIC_CONTENT_ROUTES } from "@/lib/public-content-routes";

export const CONTENT_MODELS = {
    destinations: {
        type: "destination",
        title: "Destinations",
        nameField: "name",
        publicPath: "/destinations",
    },
    experiences: {
        type: "experience",
        title: "Experiences",
        nameField: "title",
        publicPath: "/experiences",
    },
    "experience-categories": {
        type: "experienceCategory",
        title: "Experience categories",
        nameField: "name",
        publicPath: null,
    },
    packages: {
        type: "travelPackage",
        title: "Travel packages",
        nameField: "title",
        publicPath: PUBLIC_CONTENT_ROUTES.packages.path,
    },
    articles: {
        type: "article",
        title: "Articles",
        nameField: "title",
        publicPath: PUBLIC_CONTENT_ROUTES.articles.path,
    },
    guides: {
        type: "guide",
        title: "Travel guides",
        nameField: "title",
        publicPath: PUBLIC_CONTENT_ROUTES.guides.path,
    },
} as const;

export type ManagedContentKind = keyof typeof CONTENT_MODELS;

export const CONTENT_KIND_LABELS: Record<ManagedContentKind, string> = {
    destinations: "destination",
    experiences: "experience",
    "experience-categories": "experience category",
    packages: "travel package",
    articles: "article",
    guides: "travel guide",
};

export function isManagedContentKind(value: string): value is ManagedContentKind {
    return Object.hasOwn(CONTENT_MODELS, value);
}

export type ContentDocument = Record<string, unknown> & {
    _id: string;
    _type: string;
    _createdAt?: string;
    _updatedAt?: string;
    _rev?: string;
};

export type ContentAsset = {
    _id: string;
    url: string;
    originalFilename?: string;
};

export function contentDocumentName(doc: ContentDocument, kind: ManagedContentKind) {
    const value = doc[CONTENT_MODELS[kind].nameField];
    return typeof value === "string" && value.trim() ? value : "Untitled content";
}

export function canonicalContentId(id: string) {
    return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}
