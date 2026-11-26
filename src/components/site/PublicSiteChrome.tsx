"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PublicSiteChrome({
    header,
    footer,
    children,
}: {
    header: ReactNode;
    footer: ReactNode;
    children: ReactNode;
}) {
    const pathname = usePathname();
    const isDashboardRoute =
        pathname === "/dashboard" || pathname?.startsWith("/dashboard/");
    const isAuthCallbackRoute = pathname === "/auth/callback/fragment";
    const hidePublicChrome = isDashboardRoute || isAuthCallbackRoute;

    return (
        <>
            {!hidePublicChrome && header}
            <main id="main-content" className="flex-1">
                {children}
            </main>
            {!hidePublicChrome && footer}
        </>
    );
}
