import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminAuthorizationError, requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default async function ProtectedDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    let userEmail: string | null = null;
    try {
        const { user } = await requireAdmin();
        userEmail = user.email ?? null;
    } catch (error) {
        if (error instanceof AdminAuthorizationError && error.reason === "unauthenticated") {
            redirect("/dashboard/login");
        }
        redirect("/dashboard/unauthorized");
    }

    return <DashboardShell userEmail={userEmail}>{children}</DashboardShell>;
}
