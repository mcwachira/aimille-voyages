"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

const OPTIONS = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const currentTheme =
        OPTIONS.find((option) => option.value === theme) ?? OPTIONS[2];

    const Icon = currentTheme.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Change theme">
                    <Icon className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {OPTIONS.map((option) => {
                    const OptionIcon = option.icon;

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className="gap-2"
                        >
                            <OptionIcon className="h-4 w-4" />
                            <span>{option.label}</span>

                            {theme === option.value && (
                                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}