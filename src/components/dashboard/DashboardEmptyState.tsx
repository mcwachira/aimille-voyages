import type { ReactNode } from "react";

export function DashboardEmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="border border-dashed border-border bg-card/60 px-6 py-12 text-center sm:px-10">
            <span className="mx-auto block h-px w-10 bg-gold" aria-hidden="true" />
            <h2 className="mt-5 text-xl text-primary">{title}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
