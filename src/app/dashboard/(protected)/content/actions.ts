"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defineQuery } from "next-sanity";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { canonicalContentId, CONTENT_MODELS, isManagedContentKind } from "@/lib/dashboard/content/model";
import { getDashboardSanityClient } from "@/lib/dashboard/content/sanity-server";

export type ContentActionState = {
    error?: string;
    success?: string;
};

const CONTENT_DOCUMENT_BY_ID_QUERY = defineQuery(`*[_id == $id && _type == $type][0]`);
const VALIDATE_REFERENCE_IDS_QUERY = defineQuery(`*[_type == $type && _id in $ids && !(_id in path("drafts.**"))]._id`);

const shortText = z.string().trim().max(5000);
const slugValue = z.string().trim().min(1, "Enter a URL slug.").max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens for the slug.");
const assetIdValue = z.string().trim().max(180).regex(/^asset-[a-zA-Z0-9-]+$/, "Choose an image from the library.");
const referenceIdValue = z.string().trim().max(180).regex(/^(?:[A-Za-z0-9_-]+|drafts\.[A-Za-z0-9_-]+)$/, "Choose a valid content reference.");

const destinationSchema = z.object({
    name: shortText.min(1, "Enter the destination name."),
    slug: slugValue,
    country: shortText.min(1, "Enter the country."),
    region: shortText,
    summary: shortText.min(1, "Enter a short summary."),
    intro: shortText,
    special: shortText,
    experiences: shortText,
    accommodation: shortText,
    transport: shortText,
    stayLength: shortText,
    featured: z.boolean(),
    imageAssetId: assetIdValue,
    galleryAssetIds: z.array(assetIdValue).max(30),
    relatedIds: z.array(referenceIdValue).max(30),
    metaTitle: shortText,
    metaDescription: shortText,
});

const experienceSchema = z.object({
    title: shortText.min(1, "Enter the experience title."),
    slug: slugValue,
    categoryId: referenceIdValue,
    destinationId: referenceIdValue,
    description: shortText.min(1, "Enter a description."),
    considerations: shortText,
    duration: shortText,
    durationVerified: z.boolean(),
    featured: z.boolean(),
    order: z.coerce.number().int().min(0).max(100000),
    imageAssetId: assetIdValue,
    galleryAssetIds: z.array(assetIdValue).max(30),
    metaTitle: shortText,
    metaDescription: shortText,
});

const categorySchema = z.object({
    name: shortText.min(1, "Enter the category name."),
    slug: slugValue,
    blurb: shortText,
    order: z.coerce.number().int().min(0).max(100000),
    imageAssetId: z.union([assetIdValue, z.literal("")]),
});

const editorialSchema = z.object({
    title: shortText.min(1, "Enter a title."),
    slug: slugValue,
    summary: shortText,
    description: shortText,
    body: shortText,
    duration: shortText,
    category: shortText,
    publishedAt: z.union([z.literal(""), z.string().date()]),
    featured: z.boolean(),
    imageAssetId: z.union([assetIdValue, z.literal("")]),
    destinationIds: z.array(referenceIdValue).max(30),
    experienceIds: z.array(referenceIdValue).max(30),
    metaTitle: shortText,
    metaDescription: shortText,
});

async function canManageContent() {
    try {
        await requireAdmin();
        return true;
    } catch {
        return false;
    }
}

function getString(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
}

function getList(formData: FormData, key: string) {
    const entries = formData.getAll(key).filter((value): value is string => typeof value === "string");
    const value = entries.length > 1 ? entries.join("\n") : entries[0] ?? "";
    return value
        .split(/\r?\n/)
        .map((value) => value.trim())
        .filter(Boolean);
}

function getBoolean(formData: FormData, key: string) {
    return getString(formData, key) === "on";
}

function imageReference(id: string) {
    return id ? { _type: "image", asset: { _type: "reference", _ref: id } } : undefined;
}

function lineItems(values: string) {
    return values.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
}

function withoutSanityMetadata(document: Record<string, unknown>) {
    const fields = { ...document };
    delete fields._id;
    delete fields._rev;
    delete fields._createdAt;
    delete fields._updatedAt;
    return fields;
}

function referenceId(value: unknown): string | null {
    if (!value || typeof value !== "object" || !("_ref" in value)) return null;
    const id = value._ref;
    return typeof id === "string" ? id : null;
}

function imageAssetReference(value: unknown): string | null {
    if (!value || typeof value !== "object" || !("asset" in value)) return null;
    return referenceId(value.asset);
}

function preserveImagePresentation(nextImage: unknown, existingImage: unknown) {
    const nextId = imageAssetReference(nextImage);
    if (!nextId || nextId !== imageAssetReference(existingImage) || !nextImage || typeof nextImage !== "object") {
        return nextImage;
    }

    const next = nextImage as Record<string, unknown>;
    const existing = existingImage as Record<string, unknown>;
    return {
        ...next,
        ...(existing.crop && typeof existing.crop === "object" ? { crop: existing.crop } : {}),
        ...(existing.hotspot && typeof existing.hotspot === "object" ? { hotspot: existing.hotspot } : {}),
    };
}

function preserveImagePresentationForSameAssets(
    content: Record<string, unknown> & { _type: string },
    existing: Record<string, unknown>,
) {
    const result = { ...content };
    result.image = preserveImagePresentation(content.image, existing.image);

    if (Array.isArray(content.gallery)) {
        const priorByAsset = new Map<string, unknown[]>();
        for (const image of Array.isArray(existing.gallery) ? existing.gallery : []) {
            const assetId = imageAssetReference(image);
            if (!assetId) continue;
            const entries = priorByAsset.get(assetId) ?? [];
            entries.push(image);
            priorByAsset.set(assetId, entries);
        }
        result.gallery = content.gallery.map((image) => {
            const assetId = imageAssetReference(image);
            const prior = assetId ? priorByAsset.get(assetId)?.shift() : undefined;
            return prior ? preserveImagePresentation(image, prior) : image;
        });
    }

    return result;
}

function arrayReferenceIds(value: unknown): string[] {
    return Array.isArray(value)
        ? value.map(referenceId).filter((id): id is string => id !== null)
        : [];
}

function imageAssetIds(document: Record<string, unknown>): string[] {
    const image = document.image;
    const gallery = Array.isArray(document.gallery) ? document.gallery : [];
    const assetId = (entry: unknown) => {
        if (!entry || typeof entry !== "object" || !("asset" in entry)) return null;
        return referenceId(entry.asset);
    };
    return [assetId(image), ...gallery.map(assetId)].filter((id): id is string => id !== null);
}

async function referencesExist(
    sanity: ReturnType<typeof getDashboardSanityClient>,
    content: Record<string, unknown>,
) {
    const categoryId = referenceId(content.category);
    const destinationId = referenceId(content.destination);
    const groups = [
        { type: "sanity.imageAsset", ids: imageAssetIds(content) },
        { type: "destination", ids: [...arrayReferenceIds(content.related), ...arrayReferenceIds(content.destinations), ...(destinationId ? [destinationId] : [])] },
        { type: "experience", ids: [...arrayReferenceIds(content.experiences)] },
        { type: "experienceCategory", ids: categoryId ? [categoryId] : [] },
    ];
    for (const group of groups) {
        const ids = [...new Set(group.ids)];
        if (!ids.length) continue;
        const found = await sanity.fetch<string[]>(VALIDATE_REFERENCE_IDS_QUERY, { type: group.type, ids });
        if (found.length !== ids.length) return false;
    }
    return true;
}

async function readForm(kind: string, formData: FormData) {
    if (kind === "destinations") {
        const result = destinationSchema.safeParse({
            name: getString(formData, "name"),
            slug: getString(formData, "slug"),
            country: getString(formData, "country"),
            region: getString(formData, "region"),
            summary: getString(formData, "summary"),
            intro: getString(formData, "intro"),
            special: getString(formData, "special"),
            experiences: getString(formData, "experiences"),
            accommodation: getString(formData, "accommodation"),
            transport: getString(formData, "transport"),
            stayLength: getString(formData, "stayLength"),
            featured: getBoolean(formData, "featured"),
            imageAssetId: getString(formData, "imageAssetId"),
            galleryAssetIds: getList(formData, "galleryAssetIds"),
            relatedIds: getList(formData, "relatedIds"),
            metaTitle: getString(formData, "metaTitle"),
            metaDescription: getString(formData, "metaDescription"),
        });
        if (!result.success) return { error: result.error.issues[0]?.message ?? "Check the content fields." };
        const value = result.data;
        return { document: {
            _type: "destination",
            name: value.name,
            slug: { _type: "slug", current: value.slug },
            country: value.country,
            region: value.region || undefined,
            summary: value.summary,
            intro: value.intro || undefined,
            special: lineItems(value.special),
            experiences: lineItems(value.experiences),
            accommodation: value.accommodation || undefined,
            transport: value.transport || undefined,
            stayLength: value.stayLength || undefined,
            featured: value.featured,
            image: imageReference(value.imageAssetId),
            gallery: value.galleryAssetIds.map((id) => imageReference(id)),
            related: value.relatedIds.map((id) => ({ _type: "reference", _ref: canonicalContentId(id) })),
            seo: { metaTitle: value.metaTitle || undefined, metaDescription: value.metaDescription || undefined },
        } };
    }

    if (kind === "experiences") {
        const result = experienceSchema.safeParse({
            title: getString(formData, "title"),
            slug: getString(formData, "slug"),
            categoryId: getString(formData, "categoryId"),
            destinationId: getString(formData, "destinationId"),
            description: getString(formData, "description"),
            considerations: getString(formData, "considerations"),
            duration: getString(formData, "duration"),
            durationVerified: getBoolean(formData, "durationVerified"),
            featured: getBoolean(formData, "featured"),
            order: getString(formData, "order") || "0",
            imageAssetId: getString(formData, "imageAssetId"),
            galleryAssetIds: getList(formData, "galleryAssetIds"),
            metaTitle: getString(formData, "metaTitle"),
            metaDescription: getString(formData, "metaDescription"),
        });
        if (!result.success) return { error: result.error.issues[0]?.message ?? "Check the content fields." };
        const value = result.data;
        return { document: {
            _type: "experience",
            title: value.title,
            slug: { _type: "slug", current: value.slug },
            category: { _type: "reference", _ref: canonicalContentId(value.categoryId) },
            destination: { _type: "reference", _ref: canonicalContentId(value.destinationId) },
            description: value.description,
            considerations: lineItems(value.considerations),
            duration: value.duration || undefined,
            durationVerified: value.durationVerified,
            featured: value.featured,
            order: value.order,
            image: imageReference(value.imageAssetId),
            gallery: value.galleryAssetIds.map((id) => imageReference(id)),
            seo: { metaTitle: value.metaTitle || undefined, metaDescription: value.metaDescription || undefined },
        } };
    }

    if (kind === "experience-categories") {
        const result = categorySchema.safeParse({
            name: getString(formData, "name"),
            slug: getString(formData, "slug"),
            blurb: getString(formData, "blurb"),
            order: getString(formData, "order") || "0",
            imageAssetId: getString(formData, "imageAssetId"),
        });
        if (!result.success) return { error: result.error.issues[0]?.message ?? "Check the content fields." };
        const value = result.data;
        return { document: {
            _type: "experienceCategory",
            name: value.name,
            slug: { _type: "slug", current: value.slug },
            blurb: value.blurb || undefined,
            order: value.order,
            image: imageReference(value.imageAssetId),
        } };
    }

    if (kind === "packages" || kind === "articles" || kind === "guides") {
        const result = editorialSchema.safeParse({
            title: getString(formData, "title"),
            slug: getString(formData, "slug"),
            summary: getString(formData, "summary"),
            description: getString(formData, "description"),
            body: getString(formData, "body"),
            duration: getString(formData, "duration"),
            category: getString(formData, "category"),
            publishedAt: getString(formData, "publishedAt"),
            featured: getBoolean(formData, "featured"),
            imageAssetId: getString(formData, "imageAssetId"),
            destinationIds: getList(formData, "destinationIds"),
            experienceIds: getList(formData, "experienceIds"),
            metaTitle: getString(formData, "metaTitle"),
            metaDescription: getString(formData, "metaDescription"),
        });
        if (!result.success) return { error: result.error.issues[0]?.message ?? "Check the content fields." };
        const value = result.data;
        if ((kind === "packages" || kind === "guides") && !value.summary) return { error: "Enter a short summary." };
        if (kind === "articles" && (!value.summary || !value.body)) return { error: "Enter an excerpt and article body." };
        if (kind === "guides" && !value.body) return { error: "Enter the guide body." };
        const document: Record<string, unknown> & { _type: string } = {
            _type: CONTENT_MODELS[kind].type,
            title: value.title,
            slug: { _type: "slug", current: value.slug },
            featured: value.featured,
            image: imageReference(value.imageAssetId),
            seo: { metaTitle: value.metaTitle || undefined, metaDescription: value.metaDescription || undefined },
        };
        if (kind === "packages") Object.assign(document, {
            summary: value.summary,
            description: value.description || undefined,
            duration: value.duration || undefined,
            destinations: value.destinationIds.map((id) => ({ _type: "reference", _ref: canonicalContentId(id) })),
            experiences: value.experienceIds.map((id) => ({ _type: "reference", _ref: canonicalContentId(id) })),
        });
        if (kind === "articles") Object.assign(document, {
            excerpt: value.summary,
            body: value.body,
            image: imageReference(value.imageAssetId),
            category: value.category || undefined,
            publishedAt: value.publishedAt ? `${value.publishedAt}T00:00:00.000Z` : undefined,
        });
        if (kind === "guides") Object.assign(document, {
            summary: value.summary,
            body: value.body,
            destinations: value.destinationIds.map((id) => ({ _type: "reference", _ref: canonicalContentId(id) })),
            experiences: value.experienceIds.map((id) => ({ _type: "reference", _ref: canonicalContentId(id) })),
        });
        return { document };
    }

    return { error: "This content type cannot be edited here." };
}

function revalidateContent(kind: string, options: { slug?: string; publicChanged?: boolean } = {}) {
    revalidatePath("/dashboard/content");
    revalidatePath(`/dashboard/content/${kind}`);
    if (options.publicChanged) {
        const model = CONTENT_MODELS[kind as keyof typeof CONTENT_MODELS];
        if (model.publicPath) {
            revalidatePath(model.publicPath);
            if (options.slug) revalidatePath(`${model.publicPath}/${encodeURIComponent(options.slug)}`);
        }
    }
}

export async function saveContent(
    _previous: ContentActionState,
    formData: FormData,
): Promise<ContentActionState> {
    if (!(await canManageContent())) return { error: "You do not have permission to manage website content." };

    const kind = getString(formData, "kind");
    const id = getString(formData, "id");
    if (!isManagedContentKind(kind)) return { error: "This content type is unavailable." };

    const parsed = await readForm(kind, formData);
    if (!parsed.document) return { error: parsed.error };

    let createdId: string | undefined;
    try {
        const sanity = getDashboardSanityClient();
        const content = parsed.document as Record<string, unknown> & { _type: string };
        if (!(await referencesExist(sanity, content))) {
            return { error: "Choose references and images that exist in the Sanity library." };
        }

        if (id) {
            if (!/^(?:drafts\.)?[A-Za-z0-9_-]{1,128}$/.test(id)) {
                return { error: "The selected content item is invalid." };
            }
            const canonicalId = canonicalContentId(id);
            const draftId = `drafts.${canonicalId}`;
            const draft = await sanity.fetch<Record<string, unknown> | null>(
                CONTENT_DOCUMENT_BY_ID_QUERY,
                { id: draftId, type: CONTENT_MODELS[kind].type },
            );

            if (draft) {
                const preservedContent = preserveImagePresentationForSameAssets(content, draft);
                const patchFields: Record<string, unknown> = { ...preservedContent };
                delete patchFields._type;
                await sanity.patch(draftId).set(patchFields).commit();
            } else {
                const current = await sanity.fetch<Record<string, unknown> | null>(
                    CONTENT_DOCUMENT_BY_ID_QUERY,
                    { id: canonicalId, type: CONTENT_MODELS[kind].type },
                );
                if (!current) return { error: "This content item no longer exists." };
                const fields = withoutSanityMetadata(current);
                await sanity.createIfNotExists({ ...fields, _id: draftId, _type: CONTENT_MODELS[kind].type });
                const preservedContent = preserveImagePresentationForSameAssets(content, current);
                const patchFields: Record<string, unknown> = { ...preservedContent };
                delete patchFields._type;
                await sanity.patch(draftId).set(patchFields).commit();
            }
        } else {
            const created = await sanity.create({ ...content, _id: `drafts.${crypto.randomUUID()}` });
            createdId = created._id;
        }

        revalidateContent(kind);
    } catch {
        return { error: "The content could not be saved. Check the Sanity write-token configuration and try again." };
    }
    if (createdId) redirect(`/dashboard/content/${kind}/${encodeURIComponent(createdId)}`);
    return { success: "Draft saved. Publish it when it is ready for the website." };
}

export async function publishContent(
    _previous: ContentActionState,
    formData: FormData,
): Promise<ContentActionState> {
    if (!(await canManageContent())) return { error: "You do not have permission to publish website content." };
    const kind = getString(formData, "kind");
    const id = getString(formData, "id");
    if (!isManagedContentKind(kind) || !id || !/^(?:drafts\.)?[A-Za-z0-9_-]{1,128}$/.test(id)) {
        return { error: "The selected draft is invalid." };
    }

    try {
        const sanity = getDashboardSanityClient();
        const canonicalId = canonicalContentId(id);
        const draftId = `drafts.${canonicalId}`;
        const draft = await sanity.fetch<Record<string, unknown> | null>(
            CONTENT_DOCUMENT_BY_ID_QUERY,
            { id: draftId, type: CONTENT_MODELS[kind].type },
        );
        if (!draft) return { error: "The draft could not be found." };
        const slug = draft.slug && typeof draft.slug === "object" && "current" in draft.slug && typeof draft.slug.current === "string"
            ? draft.slug.current
            : undefined;
        await sanity.action({
            actionType: "sanity.action.document.publish",
            draftId,
            publishedId: canonicalId,
            ...(typeof draft._rev === "string" ? { ifDraftRevisionId: draft._rev } : {}),
        });
        revalidateContent(kind, { slug, publicChanged: true });
        return { success: "Content published to the website." };
    } catch {
        return { error: "The content could not be published. Check references and required fields, then try again." };
    }
}

export async function unpublishContent(
    _previous: ContentActionState,
    formData: FormData,
): Promise<ContentActionState> {
    if (!(await canManageContent())) return { error: "You do not have permission to unpublish website content." };
    const kind = getString(formData, "kind");
    const id = getString(formData, "id");
    if (!isManagedContentKind(kind) || !id || getString(formData, "confirmation") !== "UNPUBLISH") {
        return { error: "Confirm unpublishing this content to continue." };
    }
    if (!/^(?:drafts\.)?[A-Za-z0-9_-]{1,128}$/.test(id)) return { error: "The selected content item is invalid." };

    try {
        const sanity = getDashboardSanityClient();
        const canonicalId = canonicalContentId(id);
        const draftId = `drafts.${canonicalId}`;
        const published = await sanity.fetch<Record<string, unknown> | null>(
            CONTENT_DOCUMENT_BY_ID_QUERY,
            { id: canonicalId, type: CONTENT_MODELS[kind].type },
        );
        if (!published) return { error: "The published content could not be found." };
        const slug = published.slug && typeof published.slug === "object" && "current" in published.slug && typeof published.slug.current === "string"
            ? published.slug.current
            : undefined;
        await sanity.action({ actionType: "sanity.action.document.unpublish", draftId, publishedId: canonicalId });
        revalidateContent(kind, { slug, publicChanged: true });
        return { success: "Content unpublished from the website." };
    } catch {
        return { error: "The content could not be unpublished. Try again or check Sanity access." };
    }
}

export async function deleteContent(
    _previous: ContentActionState,
    formData: FormData,
): Promise<ContentActionState> {
    if (!(await canManageContent())) return { error: "You do not have permission to delete website content." };
    const kind = getString(formData, "kind");
    const id = getString(formData, "id");
    const confirmation = getString(formData, "confirmation");
    if (!isManagedContentKind(kind) || !id || confirmation !== "DELETE") {
        return { error: "Confirm the deletion to continue." };
    }
    if (!/^(?:drafts\.)?[A-Za-z0-9_-]{1,128}$/.test(id)) {
        return { error: "The selected content item is invalid." };
    }

    try {
        const sanity = getDashboardSanityClient();
        const canonicalId = canonicalContentId(id);
        const draftId = `drafts.${canonicalId}`;
        const [draft, published] = await Promise.all([
            sanity.fetch<Record<string, unknown> | null>(CONTENT_DOCUMENT_BY_ID_QUERY, { id: draftId, type: CONTENT_MODELS[kind].type }),
            sanity.fetch<Record<string, unknown> | null>(CONTENT_DOCUMENT_BY_ID_QUERY, { id: canonicalId, type: CONTENT_MODELS[kind].type }),
        ]);
        if (!draft && !published) return { error: "This content item no longer exists." };
        const slugValue = published?.slug;
        const slug = slugValue && typeof slugValue === "object" && "current" in slugValue && typeof slugValue.current === "string"
            ? slugValue.current
            : undefined;
        if (published) {
            await sanity.action({
                actionType: "sanity.action.document.delete",
                publishedId: canonicalId,
                includeDrafts: draft ? [draftId] : [],
            });
        } else {
            await sanity.delete(draftId);
        }
        revalidateContent(kind, { slug, publicChanged: Boolean(published) });
        return { success: "The content item was deleted." };
    } catch {
        return { error: "The content could not be deleted. Check whether another document still references it." };
    }
}
