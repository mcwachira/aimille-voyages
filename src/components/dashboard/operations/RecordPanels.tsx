import Link from "next/link";
import { ArrowLeft, AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft aria-hidden="true" className="size-4" />
            {children}
        </Link>
    );
}

export function DataState({ kind, title, detail }: { kind: "empty" | "error"; title: string; detail: string }) {
    const Icon = kind === "empty" ? Inbox : AlertCircle;
    return (
        <div className="border border-dashed border-border bg-card/70 px-6 py-12 text-center">
            <Icon aria-hidden="true" className="mx-auto size-6 text-gold-readable" />
            <h2 className="mt-4 font-serif text-xl text-primary">{title}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
    );
}

export function DetailGrid({ children }: { children: ReactNode }) {
    return <dl className="grid gap-px border border-border bg-border sm:grid-cols-2">{children}</dl>;
}

export function DetailField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="min-w-0 bg-card p-4 sm:p-5">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
            <dd className="mt-2 break-words text-sm leading-6 text-foreground">{children || <span className="text-muted-foreground">Not provided</span>}</dd>
        </div>
    );
}

export function NotesPanel({ notes, error, form }: { notes: Array<{ id: string; note: string; created_at: string }>; error: boolean; form?: ReactNode }) {
    return (
        <section className="border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-readable">Internal</p>
                    <h2 className="mt-2 font-serif text-xl text-primary">Team notes</h2>
                </div>
            </div>
            {error ? (
                <p className="mt-4 text-sm text-muted-foreground">Team notes are unavailable for this record.</p>
            ) : notes.length ? (
                <ul className="mt-4 divide-y divide-border">
                    {notes.map((note) => (
                        <li key={note.id} className="py-4 first:pt-0 last:pb-0">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{note.note}</p>
                            <time className="mt-2 block text-xs text-muted-foreground" dateTime={note.created_at}>
                                {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(note.created_at))}
                            </time>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm text-muted-foreground">No team notes are recorded for this item.</p>
            )}
            {form}
        </section>
    );
}
