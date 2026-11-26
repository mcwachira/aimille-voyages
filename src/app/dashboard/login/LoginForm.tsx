"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

type LoginState = {
    error: string;
    fieldErrors: {
        email?: string;
        password?: string;
    };
};

const initialState: LoginState = {
    error: "",
    fieldErrors: {},
};

export function LoginForm() {
    const [state, formAction, pending] = useActionState(loginAction, initialState);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form action={formAction} className="mt-8 space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-primary">
                    Email address
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    aria-invalid={Boolean(state.fieldErrors.email)}
                    aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
                    className="h-12 rounded-sm border-border bg-background px-4 text-sm focus-visible:border-gold focus-visible:ring-gold"
                    placeholder="you@example.com"
                    disabled={pending}
                />
                {state.fieldErrors.email && (
                    <p id="email-error" className="text-xs text-destructive" role="alert">
                        {state.fieldErrors.email}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-primary">
                    Password
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        aria-invalid={Boolean(state.fieldErrors.password)}
                        aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
                        className="h-12 rounded-sm border-border bg-background px-4 pr-12 text-sm focus-visible:border-gold focus-visible:ring-gold"
                        placeholder="Enter your password"
                        disabled={pending}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        aria-controls="password"
                    >
                        {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </Button>
                </div>
                {state.fieldErrors.password && (
                    <p id="password-error" className="text-xs text-destructive" role="alert">
                        {state.fieldErrors.password}
                    </p>
                )}
            </div>

            {state.error && (
                <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                    {state.error}
                </p>
            )}

            <Button
                type="submit"
                variant="gold"
                size="xl"
                className="w-full"
                disabled={pending}
            >
                {pending ? (
                    <>
                        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                        Signing in…
                    </>
                ) : (
                    "Sign in"
                )}
            </Button>
            <div className="text-center">
                <Link
                    href="/dashboard/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:text-gold-readable hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                    Forgot password?
                </Link>
            </div>
        </form>
    );
}
