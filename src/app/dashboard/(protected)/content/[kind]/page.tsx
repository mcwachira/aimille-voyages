import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICES } from "@/content/services";
import { CONTENT_MODELS, contentDocumentName, isManagedContentKind, type ContentDocument } from "@/lib/dashboard/content/model";
import { getContentDocuments } from "@/lib/dashboard/content/read";
import { hasDashboardSanityWriteAccess } from "@/lib/dashboard/content/sanity-server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = {
    params: Promise<{ kind: string }>;
    searchParams: Promise<{ q?: string }>;
};

function ServicesList() {
    return (
        <div className="space-y-6">
            <DashboardPageHeader title="Services" description="Review the service information currently used by the public website." eyebrow="Website content" />
            <div className="border border-gold/30 bg-gold/5 p-4 text-sm leading-relaxed">
                Services are currently code-managed in <code className="font-mono">src/content/services.ts</code>. This catalog is read-only so it does not create a second source of truth. Dashboard editing requires a reviewed migration into Sanity and matching updates to the public service pages.
            </div>
            <div className="overflow-x-auto border border-border bg-card">
                <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Service</th><th className="px-4 py-3 font-medium">URL slug</th><th className="px-4 py-3 font-medium">Enquiry category</th><th className="px-4 py-3 font-medium">Source</th></tr></thead>
                    <tbody>{SERVICES.map((service) => <tr key={service.slug} className="border-b border-border last:border-0"><td className="px-4 py-3 font-medium">{service.title}</td><td className="px-4 py-3 text-muted-foreground">{service.slug}</td><td className="px-4 py-3 text-muted-foreground">{service.form}</td><td className="px-4 py-3 text-muted-foreground">src/content/services.ts</td></tr>)}</tbody>
                </table>
            </div>
        </div>
    );
}

function statusOf(document: ContentDocument) {
    return document._id.startsWith("drafts.") ? "Draft" : "Published";
}

export default async function ContentKindPage({ params, searchParams }: Props) {
    const [{ kind }, { q = "" }] = await Promise.all([params, searchParams]);
    if (kind === "services") return <ServicesList />;
    if (!isManagedContentKind(kind)) return <DashboardEmptyState title="Content section not found" description="Choose an available content section from the dashboard navigation." />;

    const model = CONTENT_MODELS[kind];
    let documents: ContentDocument[] = [];
    let loadError = false;
    try {
        documents = await getContentDocuments(kind);
    } catch {
        loadError = true;
    }
    const query = q.trim().toLocaleLowerCase();
    const visible = documents.filter((document) => {
        const title = contentDocumentName(document, kind);
        const slug = typeof document.slugValue === "string" ? document.slugValue : "";
        const country = typeof document.country === "string" ? document.country : "";
        return !query || `${title} ${slug} ${country}`.toLocaleLowerCase().includes(query);
    });
    const canWrite = hasDashboardSanityWriteAccess();

    return (
        <div className="space-y-6">
            <DashboardPageHeader
                title={model.title}
                description={`Manage ${model.title.toLowerCase()} documents from the existing Sanity content model.`}
                eyebrow="Website content"
                action={canWrite ? <div className="flex flex-wrap gap-2">{kind === "experiences" && <Link className={buttonVariants({ variant: "outline" })} href="/dashboard/content/experience-categories">Manage categories</Link>}<Link className={buttonVariants({ variant: "brand" })} href={`/dashboard/content/${kind}/new`}><Plus aria-hidden="true" />New {kind === "experiences" ? "experience" : kind === "destinations" ? "destination" : kind === "experience-categories" ? "category" : kind === "packages" ? "package" : kind === "articles" ? "article" : "guide"}</Link></div> : undefined}
            />
            {!canWrite && <div className="border border-gold/40 bg-gold/5 p-4 text-sm">Content is read-only because the server-side Sanity write token is not configured. Ask a project administrator to configure <code className="font-mono">SANITY_API_WRITE_TOKEN</code> before enabling edits.</div>}
            <form className="flex flex-col gap-2 sm:flex-row" role="search">
                <label className="relative flex-1">
                    <span className="sr-only">Search {model.title.toLowerCase()}</span>
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="q" defaultValue={q} placeholder={`Search ${model.title.toLowerCase()}…`} className="pl-9" />
                </label>
                <Button type="submit" variant="outline">Search</Button>
            </form>
            {loadError ? (
                <div role="alert" className="border border-destructive/30 bg-destructive/5 p-5 text-sm">Sanity content could not be loaded. Check the configured project and dataset connection, then refresh.</div>
            ) : visible.length === 0 ? (
                <DashboardEmptyState title={query ? "No matching content" : `No ${model.title.toLowerCase()} found`} description={query ? "Try a different search term." : canWrite ? "Create the first item when approved website content is ready." : "No published records are visible with the current Sanity access."} />
            ) : (
                <div className="overflow-x-auto border border-border bg-card">
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Slug</th>{kind === "destinations" && <th className="px-4 py-3 font-medium">Country</th>}{kind === "experiences" && <th className="px-4 py-3 font-medium">Featured</th>}<th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th></tr></thead>
                        <tbody>{visible.map((document) => {
                            const id = document._id;
                            const name = contentDocumentName(document, kind);
                            const slug = typeof document.slugValue === "string" ? document.slugValue : "—";
                            return <tr key={id} className="border-b border-border last:border-0"><td className="px-4 py-3 font-medium">{name}</td><td className="px-4 py-3 text-muted-foreground">{slug}</td>{kind === "destinations" && <td className="px-4 py-3 text-muted-foreground">{String(document.country ?? "—")}</td>}{kind === "experiences" && <td className="px-4 py-3 text-muted-foreground">{document.featured === true ? "Yes" : "No"}</td>}<td className="px-4 py-3"><span className={`inline-flex border px-2 py-1 text-xs ${statusOf(document) === "Draft" ? "border-gold/50 bg-gold/10" : "border-jungle/20 bg-jungle/5 text-jungle"}`}>{statusOf(document)}</span></td><td className="px-4 py-3 text-right"><Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/dashboard/content/${kind}/${encodeURIComponent(id)}`}>{canWrite ? "Edit" : "View"}</Link></td></tr>;
                        })}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
