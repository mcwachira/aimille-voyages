import { ShieldCheck, UserPlus } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { InviteAdminForm } from "./InviteAdminForm";

export const metadata = {
    title: "Staff Access | AIMILLE VOYAGES Dashboard",
    robots: { index: false, follow: false },
};

export default function DashboardStaffPage() {
    return (
        <div>
            <DashboardPageHeader
                title="Staff access"
                description="Invite colleagues and assign the administrator access required to manage the workspace."
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
                <section className="border border-border bg-card p-5 sm:p-7">
                    <div className="mb-6 flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center border border-gold/30 bg-ivory text-jungle dark:bg-jungle dark:text-gold-readable">
                            <UserPlus className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h2 className="text-xl text-primary">Invite a staff member</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                All staff accounts receive the same administrator permissions.
                            </p>
                        </div>
                    </div>
                    <InviteAdminForm />
                </section>

                <aside className="border border-border bg-muted/40 p-5 sm:p-7">
                    <ShieldCheck className="size-5 text-gold-readable" aria-hidden="true" />
                    <h2 className="mt-4 text-lg text-primary">Access safeguards</h2>
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                        <li>Only an authenticated administrator can use this workflow.</li>
                        <li>New staff choose their own password from the Supabase invitation email.</li>
                        <li>Role assignment uses the signed-in administrator session and existing database policies.</li>
                        <li>Invitations and role changes are not performed until this form is submitted.</li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
