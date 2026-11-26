"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction, type LogoutState } from "./login/actions";

const initialState: LogoutState = { error: "" };

export function LogoutButton() {
    const [state, formAction, pending] = useActionState(logoutAction, initialState);

    return (
        <div>
            <form action={formAction}>
                <Button type="submit" variant="line" size="xl" className="text-primary" disabled={pending}>
                    {pending ? (
                        <>
                            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                            Signing out…
                        </>
                    ) : (
                        "Sign out"
                    )}
                </Button>
            </form>
            {state.error && (
                <p className="mt-3 text-sm text-destructive" role="alert">
                    {state.error}
                </p>
            )}
        </div>
    );
}
