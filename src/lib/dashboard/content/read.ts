import "server-only";

import { defineQuery } from "next-sanity";

import { client } from "@/sanity/lib/client";

import { getDashboardSanityClient, hasDashboardSanityWriteAccess } from "./sanity-server";
import { CONTENT_MODELS, type ContentAsset, type ContentDocument, type ManagedContentKind } from "./model";

const CONTENT_LIST_QUERY = defineQuery(`
    *[_type == $type] | order(_updatedAt desc) {
        ...,
        "slugValue": slug.current,
        "categoryId": category._ref,
        "destinationId": destination._ref,
        "destinationIds": destinations[]._ref,
        "experienceIds": experiences[]._ref,
        "relatedIds": related[]._ref,
        "imageAssetId": image.asset._ref,
        "galleryAssetIds": gallery[].asset._ref
    }
`);

const CONTENT_BY_ID_QUERY = defineQuery(`
    *[_type == $type && (_id == $id || _id == $draftId)][0] {
        ...,
        "slugValue": slug.current,
        "categoryId": category._ref,
        "destinationId": destination._ref,
        "destinationIds": destinations[]._ref,
        "experienceIds": experiences[]._ref,
        "relatedIds": related[]._ref,
        "imageAssetId": image.asset._ref,
        "galleryAssetIds": gallery[].asset._ref
    }
`);

const CONTENT_ASSETS_QUERY = defineQuery(`
    *[_type == "sanity.imageAsset"] | order(originalFilename asc)[0...200] {
        _id,
        url,
        originalFilename
    }
`);

const DESTINATION_REFERENCES_QUERY = defineQuery(`
    *[_type == "destination" && !(_id in path("drafts.**"))] | order(name asc){_id, name}
`);

const EXPERIENCE_CATEGORY_REFERENCES_QUERY = defineQuery(`
    *[_type == "experienceCategory" && !(_id in path("drafts.**"))] | order(name asc){_id, name}
`);

const EXPERIENCE_REFERENCES_QUERY = defineQuery(`
    *[_type == "experience" && !(_id in path("drafts.**"))] | order(title asc){_id, "name": title}
`);

export async function getContentDocuments(kind: ManagedContentKind): Promise<ContentDocument[]> {
    const contentClient = hasDashboardSanityWriteAccess()
        ? getDashboardSanityClient()
        : client;
    const documents = await contentClient.fetch<ContentDocument[]>(CONTENT_LIST_QUERY, {
        type: CONTENT_MODELS[kind].type,
    });
    const grouped = new Map<string, ContentDocument>();

    for (const document of documents) {
        const id = document._id.startsWith("drafts.")
            ? document._id.slice("drafts.".length)
            : document._id;
        const existing = grouped.get(id);
        if (!existing || document._id.startsWith("drafts.")) {
            grouped.set(id, document);
        }
    }

    return [...grouped.values()].sort((a, b) => {
        const aName = String(a[CONTENT_MODELS[kind].nameField] ?? "");
        const bName = String(b[CONTENT_MODELS[kind].nameField] ?? "");
        return aName.localeCompare(bName);
    });
}

export async function getContentDocument(
    kind: ManagedContentKind,
    requestedId: string,
): Promise<ContentDocument | null> {
    if (!/^(?:drafts\.)?[A-Za-z0-9_-]{1,128}$/.test(requestedId)) return null;

    const contentClient = hasDashboardSanityWriteAccess()
        ? getDashboardSanityClient()
        : client;
    return contentClient.fetch<ContentDocument | null>(
        CONTENT_BY_ID_QUERY,
        {
            type: CONTENT_MODELS[kind].type,
            id: requestedId,
            draftId: requestedId.startsWith("drafts.")
                ? requestedId
                : `drafts.${requestedId}`,
        },
    );
}

export async function getContentAssets(): Promise<ContentAsset[]> {
    const contentClient = hasDashboardSanityWriteAccess()
        ? getDashboardSanityClient()
        : client;
    return contentClient.fetch<ContentAsset[]>(CONTENT_ASSETS_QUERY);
}

export async function getContentReferences() {
    const contentClient = hasDashboardSanityWriteAccess()
        ? getDashboardSanityClient()
        : client;
    const [destinations, categories, experiences] = await Promise.all([
        contentClient.fetch<Array<{ _id: string; name: string }>>(DESTINATION_REFERENCES_QUERY),
        contentClient.fetch<Array<{ _id: string; name: string }>>(EXPERIENCE_CATEGORY_REFERENCES_QUERY),
        contentClient.fetch<Array<{ _id: string; name: string }>>(EXPERIENCE_REFERENCES_QUERY),
    ]);
    return { destinations, categories, experiences };
}
