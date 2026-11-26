export default function ProtectedDashboardLoading() {
    return (
        <div role="status" aria-label="Loading dashboard" className="animate-pulse">
            <span className="block h-3 w-32 bg-muted" />
            <span className="mt-4 block h-10 w-64 max-w-full bg-muted" />
            <span className="mt-3 block h-4 w-[min(32rem,100%)] bg-muted" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 border border-border bg-card p-5"><span className="block h-4 w-28 bg-muted" /><span className="mt-8 block h-8 w-20 bg-muted" /></div>)}
            </div>
            <span className="sr-only">Loading dashboard content…</span>
        </div>
    );
}
