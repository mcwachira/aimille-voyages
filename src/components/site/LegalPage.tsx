
import type { ReactNode } from "react";

type LegalPageProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

export function LegalPage({
                              title,
                              description,
                              children,
                          }: LegalPageProps) {
    return (
        <main className="container-x pb-24 pt-36 md:pb-32 md:pt-44">
            <article className="mx-auto max-w-3xl">
                <header className="border-b border-border pb-10">
                    <p className="eyebrow text-gold">
                        AIMILLE VOYAGES
                    </p>

                    <h1 className="mt-5 text-4xl leading-tight text-primary md:text-5xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            {description}
                        </p>
                    )}

                    <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Draft · Pending review
                    </p>
                </header>

                <div
                    className="legal-content mt-10 space-y-6 text-base leading-8 text-muted-foreground
                    [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:leading-snug [&_h2]:text-primary
                    [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-primary
                    [&_p]:leading-8
                    [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
                    [&_strong]:font-semibold [&_strong]:text-primary"
                >
                    {children}
                </div>
            </article>
        </main>
    );
}
