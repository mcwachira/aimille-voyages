"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    forgotPasswordAction,
    type ForgotPasswordState,
} from "./actions";

const initialState: ForgotPasswordState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

export function ForgotPasswordForm({ callbackError = false }: { callbackError?: boolean }) {
    const [state, formAction, pending] = useActionState(
        forgotPasswordAction,
        initialState,
    );

    return (
        <div className="mt-8 space-y-5">
            {callbackError && state.status === "idle" && (
                <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                    That recovery link is invalid or expired. Request a new one below.
                </p>
            )}
            {state.message && (
                <p
                    className={
                        state.status === "success"
                            ? "border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-primary"
                            : "border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                    }
                    role={state.status === "success" ? "status" : "alert"}
                    aria-live="polite"
                >
                    {state.message}
                </p>
            )}
            {state.status !== "success" && (
                <form action={formAction} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="recovery-email" className="text-sm text-primary">
                            Email address
                        </Label>
                        <Input
                            id="recovery-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={254}
                            aria-invalid={Boolean(state.fieldErrors.email)}
                            aria-describedby={state.fieldErrors.email ? "recovery-email-error" : undefined}
                            className="h-12 rounded-sm border-border bg-background px-4 text-sm focus-visible:border-gold focus-visible:ring-gold"
                            placeholder="you@example.com"
                            disabled={pending}
                        />
                        {state.fieldErrors.email && (
                            <p id="recovery-email-error" className="text-xs text-destructive" role="alert">
                                {state.fieldErrors.email}
                            </p>
                        )}
                    </div>
                    <Button type="submit" variant="gold" size="xl" className="w-full" disabled={pending}>
                        {pending ? (
                            <>
                                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                                Sending request…
                            </>
                        ) : (
                            "Send recovery instructions"
                        )}
                    </Button>
                </form>
            )}
            <div className="text-center">
                <Link
                    href="/dashboard/login"
                    className="text-sm text-primary underline-offset-4 hover:text-gold-readable hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                    Return to sign in
                </Link>
            </div>
        </div>
    );
}
