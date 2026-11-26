import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
    title: string;
    description?: string;
    eyebrow?: string;
    action?: ReactNode;
};

export function DashboardPageHeader({
    title,
    description,
    eyebrow = "AIMILLE VOYAGES · Workspace",
    action,
}: DashboardPageHeaderProps) {
    return (
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <p className="eyebrow text-gold-readable">{eyebrow}</p>
                <h1 className="mt-3 text-3xl text-primary sm:text-4xl">{title}</h1>
                {description ? (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div> : null}
        </header>
    );
}
