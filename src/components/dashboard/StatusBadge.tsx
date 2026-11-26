import { cn } from "cn";

export function StatusBadge({ status }: { status: string | null | undefined }) {
    const label = status?.trim() || "Not set";
    return (
        <span
            className={cn(
                "inline-flex max-w-full items-center border border-border bg-muted/60 px-2.5 py-1 text-xs capitalize text-foreground",
                !status && "text-muted-foreground",
            )}
        >
            <span className="truncate">{label.replaceAll("_", " ")}</span>
        </span>
    );
}
