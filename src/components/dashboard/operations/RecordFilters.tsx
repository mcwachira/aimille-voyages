import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RecordFilters({
    action,
    query,
    status,
    statuses = [],
    statusLabel = "All statuses",
}: {
    action: string;
    query?: string;
    status?: string;
    statuses?: string[];
    statusLabel?: string;
}) {
    return (
        <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="record-search">Search records</label>
            <Input
                id="record-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search by name, email or destination"
                className="h-10 max-w-xl bg-card text-sm"
            />
            {statuses.length > 0 && (
                <label className="sr-only" htmlFor="record-status">Filter by status</label>
            )}
            {statuses.length > 0 && (
                <select
                    id="record-status"
                    name="status"
                    defaultValue={status ?? ""}
                    className="h-10 border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <option value="">{statusLabel}</option>
                    {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
            )}
            <Button type="submit" variant="brand" size="lg">Apply</Button>
        </form>
    );
}
