"use client";

import { useActionState } from "react";
import { LoaderCircle, ShieldPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteOrAssignAdmin, type StaffActionState } from "./actions";

const initialState: StaffActionState = { status: "idle", message: "" };

export function InviteAdminForm() {
    const [state, formAction, pending] = useActionState(inviteOrAssignAdmin, initialState);

    return (
        <form action={formAction} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="staff-email">Staff email</Label>
                <Input
                    id="staff-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="colleague@example.com"
                    disabled={pending}
                    aria-describedby="staff-access-help"
                    className="h-12 rounded-sm"
                />
                <p id="staff-access-help" className="text-sm leading-6 text-muted-foreground">
                    New accounts receive a Supabase invitation and choose their own password. Existing verified or invited accounts can be granted administrator access without sending another email.
                </p>
            </div>

            {state.message ? (
                <p
                    className={state.status === "success"
                        ? "border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-primary"
                        : "border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"}
                    role={state.status === "error" ? "alert" : "status"}
                >
                    {state.message}
                </p>
            ) : null}

            <Button type="submit" variant="gold" size="xl" disabled={pending}>
                {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <ShieldPlus className="size-4" aria-hidden="true" />}
                {pending ? "Checking access…" : "Invite or grant admin access"}
            </Button>
        </form>
    );
}
