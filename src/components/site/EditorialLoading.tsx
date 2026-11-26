export function EditorialLoading({ label }: { label: string }) {
    return (
        <div className="container-x animate-pulse py-16" role="status" aria-busy="true" aria-label={`Loading ${label}`}>
            <div className="h-[48vh] min-h-72 bg-secondary" />
            <div className="mt-12 h-8 w-48 bg-secondary" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => <div key={item}><div className="aspect-[4/3] bg-secondary" /><div className="mt-4 h-5 w-3/4 bg-secondary" /><div className="mt-3 h-4 bg-secondary" /></div>)}
            </div>
        </div>
    );
}
