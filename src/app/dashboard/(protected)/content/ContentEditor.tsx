"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { ArrowLeft, ExternalLink, Save, Send, Trash2, Undo2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_KIND_LABELS, CONTENT_MODELS, type ContentAsset, type ContentDocument, type ManagedContentKind } from "@/lib/dashboard/content/model";

import { deleteContent, publishContent, saveContent, unpublishContent } from "./actions";

type Reference = { _id: string; name: string };

type Props = {
    kind: ManagedContentKind;
    document: ContentDocument | null;
    assets: ContentAsset[];
    destinations: Reference[];
    categories: Reference[];
    experiences: Reference[];
    canWrite: boolean;
    supportingDataError: boolean;
};

function textValue(document: ContentDocument | null, key: string, fallback = "") {
    const value = key.startsWith("seo.")
        ? (document?.seo as Record<string, unknown> | undefined)?.[key.slice(4)]
        : document?.[key];
    return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function boolValue(document: ContentDocument | null, key: string) {
    return document?.[key] === true;
}

function linesValue(document: ContentDocument | null, key: string) {
    const value = document?.[key];
    return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string").join("\n")
        : "";
}

function idsValue(document: ContentDocument | null, key: string) {
    const value = document?.[key];
    return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string").map((id) => id.replace(/^drafts\./, ""))
        : [];
}

function RecordActionForm({
    action,
    kind,
    id,
    label,
    variant,
    icon,
    confirmation,
    confirmationValue = "DELETE",
}: {
    action: typeof publishContent | typeof deleteContent | typeof unpublishContent;
    kind: ManagedContentKind;
    id: string;
    label: string;
    variant: "gold" | "destructive";
    icon: ReactNode;
    confirmation?: string;
    confirmationValue?: "DELETE" | "UNPUBLISH";
}) {
    const [state, formAction, pending] = useActionState(action, {});
    return (
        <form action={formAction} onSubmit={confirmation ? (event) => {
            if (!window.confirm(confirmation)) event.preventDefault();
        } : undefined}>
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="id" value={id} />
            {confirmation && <input type="hidden" name="confirmation" value={confirmationValue} />}
            <Button type="submit" variant={variant} disabled={pending}>{icon}{pending ? "Working…" : label}</Button>
            {state.error && <p role="alert" className="mt-2 text-sm text-destructive">{state.error}</p>}
            {state.success && <p role="status" className="mt-2 text-sm text-jungle">{state.success}</p>}
        </form>
    );
}

function imageId(document: ContentDocument | null) {
    const value = document?.imageAssetId;
    return typeof value === "string" ? value : "";
}

function referenceId(document: ContentDocument | null, key: string) {
    const value = document?.[key];
    return typeof value === "string" ? value.replace(/^drafts\./, "") : "";
}

function Field({ label, name, defaultValue = "", required = false, type = "text", help }: {
    label: string;
    name: string;
    defaultValue?: string;
    required?: boolean;
    type?: string;
    help?: string;
}) {
    return (
        <label className="grid gap-1.5 text-sm text-foreground">
            <span>{label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}</span>
            <Input name={name} type={type} defaultValue={defaultValue} required={required} maxLength={name === "slug" ? 96 : 5000} />
            {help && <span className="text-xs text-muted-foreground">{help}</span>}
        </label>
    );
}

function LongField({ label, name, defaultValue = "", required = false, rows = 4, help }: {
    label: string;
    name: string;
    defaultValue?: string;
    required?: boolean;
    rows?: number;
    help?: string;
}) {
    return (
        <label className="grid gap-1.5 text-sm text-foreground">
            <span>{label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}</span>
            <Textarea name={name} defaultValue={defaultValue} required={required} rows={rows} maxLength={5000} />
            {help && <span className="text-xs text-muted-foreground">{help}</span>}
        </label>
    );
}

function CheckField({ label, name, checked = false, help }: { label: string; name: string; checked?: boolean; help?: string }) {
    return (
        <label className="flex items-start gap-2.5 text-sm text-foreground">
            <input className="mt-0.5 size-4 accent-jungle focus-visible:outline-2 focus-visible:outline-offset-2" type="checkbox" name={name} defaultChecked={checked} />
            <span>{label}{help && <span className="mt-1 block text-xs text-muted-foreground">{help}</span>}</span>
        </label>
    );
}

function SelectField({ label, name, options, defaultValue = "", required = false, help }: {
    label: string;
    name: string;
    options: Array<{ value: string; label: string }>;
    defaultValue?: string;
    required?: boolean;
    help?: string;
}) {
    return (
        <label className="grid gap-1.5 text-sm text-foreground">
            <span>{label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}</span>
            <select className="h-9 w-full min-w-0 border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50" name={name} defaultValue={defaultValue} required={required}>
                <option value="">Select an option</option>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {help && <span className="text-xs text-muted-foreground">{help}</span>}
        </label>
    );
}

function MultiSelectField({ label, name, options, defaultValue = [], help }: {
    label: string;
    name: string;
    options: Array<{ value: string; label: string }>;
    defaultValue?: string[];
    help?: string;
}) {
    return (
        <label className="grid gap-1.5 text-sm text-foreground">
            <span>{label}</span>
            <select className="min-h-28 w-full min-w-0 border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50" name={name} multiple defaultValue={defaultValue}>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {help && <span className="text-xs text-muted-foreground">{help}</span>}
        </label>
    );
}

function ImageField({ assets, defaultValue }: { assets: ContentAsset[]; defaultValue: string; }) {
    return (
        <SelectField
            label="Main image"
            name="imageAssetId"
            defaultValue={defaultValue}
            required={true}
            help={`${assets.length ? "Choose an existing image asset from Sanity." : "No image assets were returned. Configure the Sanity write token and add approved assets in Studio."} Keeping the same image retains its crop and hotspot framing; a newly selected asset uses its default framing.`}
            options={assets.map((asset) => ({ value: asset._id, label: asset.originalFilename || asset._id }))}
        />
    );
}

export function ContentEditor({ kind, document, assets, destinations, categories, experiences, canWrite, supportingDataError }: Props) {
    const [state, action, pending] = useActionState(saveContent, {});
    const model = CONTENT_MODELS[kind];
    const documentId = document?._id ?? "";
    const displayTitle = textValue(document, model.nameField, `New ${CONTENT_KIND_LABELS[kind]}`);
    const isDraft = documentId.startsWith("drafts.") || !documentId;
    const slug = textValue(document, "slugValue");
    const publicPreview = model.publicPath && slug && !isDraft ? `${model.publicPath}/${slug}` : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/dashboard/content/${kind}`}><ArrowLeft aria-hidden="true" />Back to {model.title}</Link>
                <div className="flex items-center gap-2">
                    <span className={`border px-2.5 py-1 text-xs ${isDraft ? "border-gold/50 bg-gold/10 text-foreground" : "border-jungle/20 bg-jungle/5 text-jungle"}`}>
                        {isDraft ? "Draft" : "Published"}
                    </span>
                    {publicPreview && <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={publicPreview} target="_blank"><ExternalLink aria-hidden="true" />View live page</Link>}
                </div>
            </div>

            <form action={action} className="space-y-6">
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={documentId} />

                <fieldset disabled={!canWrite || supportingDataError || pending} className="grid gap-5 border border-border bg-card p-5 sm:p-7 disabled:opacity-70">
                    <div>
                        <h2 className="font-serif text-2xl text-primary">{displayTitle}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Changes are saved as a draft. Publishing is a separate action.</p>
                    </div>

                    {kind === "destinations" && <>
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Name" name="name" defaultValue={textValue(document, "name")} required /><Field label="URL slug" name="slug" defaultValue={slug} required help="Lowercase letters, numbers and hyphens." /></div>
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Country" name="country" defaultValue={textValue(document, "country")} required /><Field label="Region" name="region" defaultValue={textValue(document, "region")} /></div>
                        <LongField label="Short summary" name="summary" defaultValue={textValue(document, "summary")} required rows={3} />
                        <LongField label="Introduction" name="intro" defaultValue={textValue(document, "intro")} />
                        <div className="grid gap-4 sm:grid-cols-2"><LongField label="What makes this destination special" name="special" defaultValue={linesValue(document, "special")} help="One item per line." /><LongField label="Activity ideas" name="experiences" defaultValue={linesValue(document, "experiences")} help="One item per line." /></div>
                        <div className="grid gap-4 sm:grid-cols-2"><LongField label="Accommodation information" name="accommodation" defaultValue={textValue(document, "accommodation")} /><LongField label="Transport information" name="transport" defaultValue={textValue(document, "transport")} /></div>
                        <Field label="Recommended stay length" name="stayLength" defaultValue={textValue(document, "stayLength")} />
                        <ImageField assets={assets} defaultValue={imageId(document)} />
                        <MultiSelectField label="Gallery images" name="galleryAssetIds" defaultValue={idsValue(document, "galleryAssetIds")} options={assets.map((asset) => ({ value: asset._id, label: asset.originalFilename || asset._id }))} help="Select existing image assets. Use Ctrl or Command to select more than one. Existing crop and hotspot framing is retained for images you keep." />
                        <MultiSelectField label="Related destinations" name="relatedIds" defaultValue={idsValue(document, "relatedIds")} options={destinations.map((item) => ({ value: item._id, label: item.name }))} help="Select existing destinations to relate to this page." />
                        <CheckField label="Feature this destination" name="featured" checked={boolValue(document, "featured")} />
                    </>}

                    {kind === "experiences" && <>
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Title" name="title" defaultValue={textValue(document, "title")} required /><Field label="URL slug" name="slug" defaultValue={slug} required /></div>
                        <div className="grid gap-4 sm:grid-cols-2"><SelectField label="Experience category" name="categoryId" defaultValue={referenceId(document, "categoryId")} required options={categories.map((item) => ({ value: item._id, label: item.name }))} /><SelectField label="Destination" name="destinationId" defaultValue={referenceId(document, "destinationId")} required options={destinations.map((item) => ({ value: item._id, label: item.name }))} /></div>
                        <LongField label="Description" name="description" defaultValue={textValue(document, "description")} required rows={5} />
                        <LongField label="Important considerations" name="considerations" defaultValue={linesValue(document, "considerations")} help="One item per line." />
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Duration" name="duration" defaultValue={textValue(document, "duration")} /><Field label="Display order" name="order" type="number" defaultValue={textValue(document, "order", "0")} /></div>
                        <ImageField assets={assets} defaultValue={imageId(document)} />
                        <CheckField label="Duration verified" name="durationVerified" checked={boolValue(document, "durationVerified")} help="The public website displays a duration only when this is selected." />
                        <CheckField label="Feature this experience" name="featured" checked={boolValue(document, "featured")} />
                        <MultiSelectField label="Gallery images" name="galleryAssetIds" defaultValue={idsValue(document, "galleryAssetIds")} options={assets.map((asset) => ({ value: asset._id, label: asset.originalFilename || asset._id }))} help="Select existing image assets. Use Ctrl or Command to select more than one. Existing crop and hotspot framing is retained for images you keep." />
                    </>}

                    {kind === "experience-categories" && <>
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Name" name="name" defaultValue={textValue(document, "name")} required /><Field label="URL slug" name="slug" defaultValue={slug} required /></div>
                        <LongField label="Short description" name="blurb" defaultValue={textValue(document, "blurb")} rows={3} />
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Display order" name="order" type="number" defaultValue={textValue(document, "order", "0")} /><SelectField label="Category image" name="imageAssetId" defaultValue={imageId(document)} options={assets.map((asset) => ({ value: asset._id, label: asset.originalFilename || asset._id }))} /></div>
                    </>}

                    {(kind === "packages" || kind === "articles" || kind === "guides") && <>
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="Title" name="title" defaultValue={textValue(document, "title")} required /><Field label="URL slug" name="slug" defaultValue={slug} required /></div>
                        {(kind === "packages" || kind === "guides" || kind === "articles") && <LongField label={kind === "articles" ? "Excerpt" : "Short summary"} name="summary" defaultValue={textValue(document, kind === "articles" ? "excerpt" : "summary")} required rows={3} />}
                        {kind === "packages" && <><LongField label="Description" name="description" defaultValue={textValue(document, "description")} /><Field label="Duration" name="duration" defaultValue={textValue(document, "duration")} /><MultiSelectField label="Destinations" name="destinationIds" defaultValue={idsValue(document, "destinationIds")} options={destinations.map((item) => ({ value: item._id, label: item.name }))} help="Select existing destinations related to this package." /><MultiSelectField label="Experiences" name="experienceIds" defaultValue={idsValue(document, "experienceIds")} options={experiences.map((item) => ({ value: item._id, label: item.name }))} help="Select existing experiences related to this package." /></>}
                        {(kind === "articles" || kind === "guides") && <LongField label="Body" name="body" defaultValue={textValue(document, "body")} required rows={14} help="Plain text content is supported by this initial model; richer block editing can be added without changing existing public queries." />}
                        {kind === "articles" && <div className="grid gap-4 sm:grid-cols-2"><Field label="Category" name="category" defaultValue={textValue(document, "category")} /><Field label="Publication date" name="publishedAt" type="date" defaultValue={textValue(document, "publishedAt").slice(0, 10)} /></div>}
                        {kind === "guides" && <><MultiSelectField label="Destinations" name="destinationIds" defaultValue={idsValue(document, "destinationIds")} options={destinations.map((item) => ({ value: item._id, label: item.name }))} help="Select existing destinations related to this guide." /><MultiSelectField label="Experiences" name="experienceIds" defaultValue={idsValue(document, "experienceIds")} options={experiences.map((item) => ({ value: item._id, label: item.name }))} help="Select existing experiences related to this guide." /></>}
                        <SelectField label="Main image (optional)" name="imageAssetId" defaultValue={imageId(document)} options={assets.map((asset) => ({ value: asset._id, label: asset.originalFilename || asset._id }))} />
                        <CheckField label="Feature this content" name="featured" checked={boolValue(document, "featured")} />
                        <div className="grid gap-4 sm:grid-cols-2"><Field label="SEO title" name="metaTitle" defaultValue={textValue(document, "seo.metaTitle")} /><LongField label="SEO description" name="metaDescription" defaultValue={textValue(document, "seo.metaDescription")} rows={3} /></div>
                    </>}

                    {(kind === "destinations" || kind === "experiences") && <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2"><Field label="SEO title" name="metaTitle" defaultValue={textValue(document, "seo.metaTitle")} /><LongField label="SEO description" name="metaDescription" defaultValue={textValue(document, "seo.metaDescription")} rows={3} /></div>}

                    <div aria-live="polite" className="min-h-5 text-sm">
                        {state.error && <p className="text-destructive">{state.error}</p>}
                        {state.success && <p className="text-jungle">{state.success}</p>}
                    </div>
                </fieldset>
                {!canWrite && <p className="border border-gold/40 bg-gold/5 p-4 text-sm">Editing is disabled because the server-side Sanity write token is not configured.</p>}
                {canWrite && <Button type="submit" variant="brand" disabled={pending || supportingDataError}><Save aria-hidden="true" />{pending ? "Saving…" : "Save draft"}</Button>}
            </form>

            {supportingDataError && <p role="alert" className="border border-destructive/30 bg-destructive/5 p-4 text-sm">Content references and image assets could not be loaded. Editing is paused to avoid replacing existing references with incomplete data. Refresh to try again.</p>}
            {canWrite && documentId && (
                <div className="flex flex-wrap items-center gap-3 border border-border bg-card p-5">
                    {isDraft && <RecordActionForm action={publishContent} kind={kind} id={documentId} label="Publish draft" variant="gold" icon={<Send aria-hidden="true" />} />}
                    {!isDraft && <RecordActionForm action={unpublishContent} kind={kind} id={documentId} label="Unpublish" variant="gold" icon={<Undo2 aria-hidden="true" />} confirmation="Unpublish this content from the website? The draft will remain available for editing." confirmationValue="UNPUBLISH" />}
                    <RecordActionForm action={deleteContent} kind={kind} id={documentId} label="Delete" variant="destructive" icon={<Trash2 aria-hidden="true" />} confirmation="Delete this content item and its published version? This cannot be undone." />
                </div>
            )}
        </div>
    );
}
