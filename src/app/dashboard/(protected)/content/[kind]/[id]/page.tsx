import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { CONTENT_KIND_LABELS, CONTENT_MODELS, isManagedContentKind, type ContentAsset, type ContentDocument } from "@/lib/dashboard/content/model";
import { getContentAssets, getContentDocument, getContentReferences } from "@/lib/dashboard/content/read";
import { hasDashboardSanityWriteAccess } from "@/lib/dashboard/content/sanity-server";

import { ContentEditor } from "../../ContentEditor";

export const metadata: Metadata = { title: "Edit Website Content | AIMILLE VOYAGES", robots: { index: false, follow: false } };

type Props = { params: Promise<{ kind: string; id: string }> };

export default async function ContentDetailPage({ params }: Props) {
    const { kind, id } = await params;
    if (!isManagedContentKind(kind)) {
        if (["services", "packages", "articles", "guides"].includes(kind)) return <DashboardEmptyState title="This section is not editable" description="This content type has no approved Sanity management model yet." />;
        notFound();
    }

    let document: ContentDocument | null = null;
    let assets: ContentAsset[] = [];
    let references: Awaited<ReturnType<typeof getContentReferences>> = { destinations: [], categories: [], experiences: [] };
    let loadError = false;
    let supportingDataError = false;
    if (id !== "new") {
        try {
            document = await getContentDocument(kind, id);
        } catch {
            loadError = true;
        }
        if (!loadError && !document) notFound();
    }
    if (!loadError) {
        try {
            [assets, references] = await Promise.all([getContentAssets(), getContentReferences()]);
        } catch {
            supportingDataError = true;
        }
    }

    const title = CONTENT_KIND_LABELS[kind];
    return (
        <div className="space-y-6">
            <DashboardPageHeader title={id === "new" ? `New ${title.toLowerCase()}` : `Edit ${title.toLowerCase()}`} description="Review the existing content carefully before saving or publishing changes." eyebrow={CONTENT_MODELS[kind].title} />
            {loadError ? (
                <div role="alert" className="border border-destructive/30 bg-destructive/5 p-5 text-sm">The selected Sanity document could not be loaded. Check the dataset connection and refresh.</div>
            ) : (
                <ContentEditor kind={kind} document={document} assets={assets} destinations={references.destinations} categories={references.categories} experiences={references.experiences} canWrite={hasDashboardSanityWriteAccess()} supportingDataError={supportingDataError} />
            )}
        </div>
    );
}
