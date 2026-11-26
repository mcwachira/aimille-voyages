"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { resetPasswordAction, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

export function ResetPasswordForm({
    action = resetPasswordAction,
}: {
    action?: typeof resetPasswordAction;
}) {
    const [state, formAction, pending] = useActionState(
        action,
        initialState,
    );

    if (state.status === "success") {
        return (
            <div className="mt-8 space-y-5">
                <p className="border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-primary" role="status" aria-live="polite">
                    {state.message}
                </p>
                <Link
                    href="/dashboard/login"
                    className={buttonVariants({ variant: "gold", size: "xl", className: "w-full" })}
                >
                    Continue to sign in
                </Link>
            </div>
        );
    }

    return (
        <form action={formAction} className="mt-8 space-y-5">
            {state.message && (
                <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                    {state.message}
                </p>
            )}
            <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm text-primary">
                    New password
                </Label>
                <Input
                    id="new-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    aria-invalid={Boolean(state.fieldErrors.password)}
                    aria-describedby={state.fieldErrors.password ? "new-password-error" : undefined}
                    className="h-12 rounded-sm border-border bg-background px-4 text-sm focus-visible:border-gold focus-visible:ring-gold"
                    disabled={pending}
                />
                {state.fieldErrors.password && (
                    <p id="new-password-error" className="text-xs text-destructive" role="alert">
                        {state.fieldErrors.password}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm text-primary">
                    Confirm new password
                </Label>
                <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    aria-invalid={Boolean(state.fieldErrors.confirmPassword)}
                    aria-describedby={state.fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                    className="h-12 rounded-sm border-border bg-background px-4 text-sm focus-visible:border-gold focus-visible:ring-gold"
                    disabled={pending}
                />
                {state.fieldErrors.confirmPassword && (
                    <p id="confirm-password-error" className="text-xs text-destructive" role="alert">
                        {state.fieldErrors.confirmPassword}
                    </p>
                )}
            </div>
            <Button type="submit" variant="gold" size="xl" className="w-full" disabled={pending}>
                {pending ? (
                    <>
                        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                        Updating password…
                    </>
                ) : (
                    "Update password"
                )}
            </Button>
        </form>
    );
}
