import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getDashboardSanityClient } from "@/lib/dashboard/content/sanity-server";
import { revalidatePath } from "next/cache";
import { deleteContent, publishContent, saveContent, unpublishContent } from "./actions";

vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/dashboard/content/sanity-server", () => ({ getDashboardSanityClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

function form(fields: Record<string, string>) {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
}

function authorizeStaff() {
    vi.mocked(requireAdmin).mockResolvedValue({ user: { id: "admin-id" }, supabase: {} } as never);
}

describe("Sanity content lifecycle actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authorizeStaff();
    });

    it("publishes a draft through the Sanity publish action", async () => {
        const action = vi.fn().mockResolvedValue({});
        const fetch = vi.fn().mockResolvedValue({ _rev: "rev-1", slug: { current: "serengeti" } });
        vi.mocked(getDashboardSanityClient).mockReturnValue({ fetch, action } as never);

        const result = await publishContent({}, form({ kind: "destinations", id: "drafts.serengeti" }));

        expect(result.success).toContain("published");
        expect(action).toHaveBeenCalledWith({
            actionType: "sanity.action.document.publish",
            draftId: "drafts.serengeti",
            publishedId: "serengeti",
            ifDraftRevisionId: "rev-1",
        });
    });

    it("unpublishes an existing published document and its canonical route is revalidated", async () => {
        const action = vi.fn().mockResolvedValue({});
        const fetch = vi.fn().mockResolvedValue({ slug: { current: "serengeti" } });
        vi.mocked(getDashboardSanityClient).mockReturnValue({ fetch, action } as never);

        const result = await unpublishContent({}, form({ kind: "destinations", id: "serengeti", confirmation: "UNPUBLISH" }));

        expect(result.success).toContain("unpublished");
        expect(action).toHaveBeenCalledWith({
            actionType: "sanity.action.document.unpublish",
            draftId: "drafts.serengeti",
            publishedId: "serengeti",
        });
        const { revalidatePath } = await import("next/cache");
        expect(revalidatePath).toHaveBeenCalledWith("/destinations/serengeti");
    });

    it("revalidates the public package listing and detail path after dashboard publication", async () => {
        const action = vi.fn().mockResolvedValue({});
        const fetch = vi.fn().mockResolvedValue({ slug: { current: "coast-escape" } });
        vi.mocked(getDashboardSanityClient).mockReturnValue({ fetch, action } as never);

        const result = await publishContent({}, form({ kind: "packages", id: "drafts.package-1" }));

        expect(result.success).toContain("published");
        expect(revalidatePath).toHaveBeenCalledWith("/packages");
        expect(revalidatePath).toHaveBeenCalledWith("/packages/coast-escape");
    });

    it("requires explicit deletion confirmation before invoking Sanity", async () => {
        const result = await deleteContent({}, form({ kind: "destinations", id: "serengeti" }));

        expect(result.error).toContain("Confirm");
        expect(getDashboardSanityClient).not.toHaveBeenCalled();
    });

    it("rejects Sanity asset references that do not exist before saving", async () => {
        const create = vi.fn();
        const fetch = vi.fn().mockResolvedValue([]);
        vi.mocked(getDashboardSanityClient).mockReturnValue({ fetch, create } as never);
        const result = await saveContent({}, form({
            kind: "destinations",
            id: "",
            name: "Example destination",
            slug: "example-destination",
            country: "Kenya",
            summary: "A short description",
            imageAssetId: "asset-missing-jpg",
        }));

        expect(result.error).toContain("references and images");
        expect(create).not.toHaveBeenCalled();
    });

    it("preserves hotspot and crop data for unchanged images without applying it to replacement assets", async () => {
        const heroCrop = { _type: "sanity.imageCrop", top: 0.1, bottom: 0.2, left: 0.05, right: 0.15 };
        const heroHotspot = { _type: "sanity.imageHotspot", x: 0.5, y: 0.4, width: 0.7, height: 0.6 };
        const set = vi.fn().mockReturnValue({ commit: vi.fn().mockResolvedValue({}) });
        const fetch = vi.fn()
            .mockResolvedValueOnce(["asset-hero", "asset-gallery-new"])
            .mockResolvedValueOnce({
                image: { _type: "image", asset: { _ref: "asset-hero" }, crop: heroCrop, hotspot: heroHotspot },
                gallery: [{ _type: "image", asset: { _ref: "asset-gallery-old" }, crop: { left: 0.2 }, hotspot: { x: 0.3 } }],
            });
        const patch = vi.fn(() => ({ set }));
        vi.mocked(getDashboardSanityClient).mockReturnValue({ fetch, patch } as never);

        const result = await saveContent({}, form({
            kind: "destinations",
            id: "drafts.destination-1",
            name: "Coastal destination",
            slug: "coastal-destination",
            country: "Kenya",
            summary: "A short description",
            imageAssetId: "asset-hero",
            galleryAssetIds: "asset-gallery-new",
        }));

        expect(result.success).toContain("Draft saved");
        const fields = set.mock.calls[0]?.[0] as Record<string, unknown>;
        expect(fields.image).toMatchObject({ crop: heroCrop, hotspot: heroHotspot });
        expect(fields.gallery).toEqual([{ _type: "image", asset: { _type: "reference", _ref: "asset-gallery-new" } }]);
    });

    it("does not delete a content ID that no longer exists", async () => {
        const action = vi.fn();
        const remove = vi.fn();
        const fetch = vi.fn().mockResolvedValue(null);
        vi.mocked(getDashboardSanityClient).mockReturnValue({ fetch, action, delete: remove } as never);

        const result = await deleteContent({}, form({ kind: "destinations", id: "missing-item", confirmation: "DELETE" }));

        expect(result.error).toContain("no longer exists");
        expect(action).not.toHaveBeenCalled();
        expect(remove).not.toHaveBeenCalled();
    });

    it("does not call Sanity when an authenticated non-admin invokes the action directly", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new Error("forbidden"));

        const result = await unpublishContent({}, form({ kind: "destinations", id: "serengeti", confirmation: "UNPUBLISH" }));

        expect(result.error).toContain("permission");
        expect(getDashboardSanityClient).not.toHaveBeenCalled();
    });
});
