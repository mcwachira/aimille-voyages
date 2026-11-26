import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageHref(path: string, page: number, query?: string, status?: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    if (page > 1) params.set("page", String(page));
    const search = params.toString();
    return search ? `${path}?${search}` : path;
}

export function RecordPagination({
    path,
    page,
    totalPages,
    query,
    status,
}: {
    path: string;
    page: number;
    totalPages: number;
    query?: string;
    status?: string;
}) {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Record pages" className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card px-4 py-3 sm:px-5">
            <p className="text-sm text-muted-foreground" aria-current="page">Page <span className="font-medium text-foreground">{page}</span> of {totalPages}</p>
            <div className="flex items-center gap-2">
                {page > 1 ? (
                    <Link rel="prev" href={pageHref(path, page - 1, query, status)} className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <ChevronLeft aria-hidden="true" className="size-4" /> Previous
                    </Link>
                ) : (
                    <span aria-disabled="true" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm text-muted-foreground opacity-60">
                        <ChevronLeft aria-hidden="true" className="size-4" /> Previous
                    </span>
                )}
                {page < totalPages ? (
                    <Link rel="next" href={pageHref(path, page + 1, query, status)} className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        Next <ChevronRight aria-hidden="true" className="size-4" />
                    </Link>
                ) : (
                    <span aria-disabled="true" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm text-muted-foreground opacity-60">
                        Next <ChevronRight aria-hidden="true" className="size-4" />
                    </span>
                )}
            </div>
        </nav>
    );
}
