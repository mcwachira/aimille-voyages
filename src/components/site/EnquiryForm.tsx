
"use client";

import { useMemo, useState } from "react";
import {
    Controller,
    useForm,
    useWatch,
    type Resolver,
    type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { FORMS, type EnquiryCategory, type Field } from "@/content/forms";
import { SUPPLIER_NOTE } from "@/content/site";
import { submitEnquiry } from "@/app/actions/submit-enquiry";
import { track } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { EnquirySuccess } from "./EnquirySuccess";

type FormValues = {
    [key: string]: string | boolean;
    consent: boolean;
    website: string;
};

const NUMERIC_COLUMNS = new Set(["adults", "children"]);

export const fieldClass =
    "min-h-12 w-full rounded-sm border-input bg-card/60 text-base shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-gold";

function buildFormSchema(fields: Field[]) {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of fields) {
        let validator = z.string().trim();
        if (field.required) {
            validator = validator.refine(
                (value) => value.length > 0,
                "This field is required",
            );
        }

        if (field.type === "email") {
            validator = validator.refine(
                (value) =>
                    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                "Please enter a valid email address",
            );
        }

        if (field.type === "tel") {
            validator = validator.refine((value) => {
                if (!value) return true;
                if (!/^\+?[0-9\s().-]+$/.test(value)) return false;

                const digits = value.replace(/\D/g, "");
                return digits.length >= 7 && digits.length <= 15;
            }, "Please enter a valid phone or WhatsApp number");
        }

        if (field.type === "date") {
            validator = validator.refine((value) => {
                if (!value) return true;

                const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
                if (!match) return false;

                const [, year, month, day] = match.map(Number);
                const date = new Date(Date.UTC(year, month - 1, day));

                return (
                    date.getUTCFullYear() === year &&
                    date.getUTCMonth() === month - 1 &&
                    date.getUTCDate() === day &&
                    value >= getTodayLocalDate()
                );
            }, "Please enter a valid future date");
        }

        if (field.type === "number") {
            validator = validator.refine(
                (value) =>
                    !value ||
                    (Number.isFinite(Number(value)) && Number(value) >= 0),
                "Please enter a valid number",
            );
        }

        shape[field.name] = validator;
    }

    shape.consent = z.boolean().refine(
        (value) => value === true,
        "Please accept the privacy notice",
    );

    shape.website = z.string();


    return z.object(shape).superRefine((values, context) => {
        for (const field of fields) {
            if (!field.after) continue;

            const currentDate = values[field.name];
            const startDate = values[field.after];

            if (
                typeof currentDate === "string" &&
                typeof startDate === "string" &&
                currentDate &&
                startDate &&
                currentDate < startDate
            ) {
                context.addIssue({
                    code: "custom",
                    path: [field.name],
                    message: "This date cannot be earlier than the start date",
                });
            }
        }
    });
}

function getTodayLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function EnquiryForm({
                                category,
                                sourcePage,
                                whatsappTopic,
                                defaults = {},
                            }: {
    category: EnquiryCategory;
    sourcePage: string;
    whatsappTopic: string;
    defaults?: Record<string, string>;
}) {
    const cfg = FORMS[category];

    const schema = useMemo(
        () => buildFormSchema(cfg.fields),
        [cfg.fields],
    );

    const initialValues = useMemo(() => {
        const values: FormValues = {
            consent: false,
            website: "",
        };

        for (const field of cfg.fields) {
            values[field.name] = defaults[field.name] ?? "";
        }

        return values;
    }, [cfg.fields, defaults]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const [serverError, setServerError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const today = getTodayLocalDate();
    const watchedValues = useWatch({ control });

    function getMinimumDate(field: Field): string | undefined {
        if (field.type !== "date") return undefined;

        if (field.after) {
            const startDate = watchedValues[field.after];

            return typeof startDate === "string" && startDate
                ? startDate
                : today;
        }

        return today;
    }

    async function onSubmit(values: FormValues) {
        setServerError(null);

        const details: Record<string, string> = {};

        const payload: Record<string, unknown> = {
            category,
            details,
            source_page: sourcePage,
            consent: values.consent === true,
            website: values.website,
        };

        for (const field of cfg.fields) {
            const value = String(values[field.name] ?? "").trim();

            if (!value) continue;

            // These are mandatory top-level fields in the server schema.
            if (
                field.name === "client_name" ||
                field.name === "email"
            ) {
                payload[field.name] = value;
                continue;
            }

            if (field.column) {
                payload[field.column] = NUMERIC_COLUMNS.has(field.column)
                    ? Number(value)
                    : value;
            } else {
                details[field.label] = value;
            }
        }

        try {
            await submitEnquiry(payload);

            track("enquiry_submit", { category });

            setSubmitted(true);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        }
    }

    if (submitted) {
        return <EnquirySuccess whatsappTopic={whatsappTopic} />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-7"
        >
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                {cfg.fields.map((field) => (
                    <FieldInput
                        key={field.name}
                        field={field}
                        register={register}
                        error={errors[field.name]?.message as string | undefined}
                        min={getMinimumDate(field)}
                    />
                ))}
            </div>

            {/* Honeypot field for basic spam detection */}
            <div
                className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                aria-hidden="true"
            >
                <label htmlFor="enquiry-website">Website</label>
                <input
                    id="enquiry-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                />
            </div>

            {/* Privacy consent */}
            <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                    <ConsentRow
                        checked={field.value === true}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.consent?.message as string | undefined}
                    />
                )}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
                {SUPPLIER_NOTE}
            </p>

            {serverError && (
                <p
                    className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                    role="alert"
                >
                    {serverError}
                </p>
            )}

            <Button
                type="submit"
                variant="brand"
                size="xl"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending enquiry...
                    </>
                ) : (
                    "Send enquiry"
                )}
            </Button>

            <p className="text-center text-xs text-muted-foreground sm:text-left">
                Your information will only be used to respond to your enquiry.
            </p>
        </form>
    );
}



type ConsentRowProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    onBlur?: () => void;
    error?: string;
};

export function ConsentRow({
                               checked,
                               onChange,
                               onBlur,
                               error,
                           }: ConsentRowProps) {
    return (
        <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => onChange(value === true)}
                    onBlur={onBlur}
                    className="mt-0.5"
                    aria-invalid={!!error}
                />

                <span>
                    I agree that AIMILLE VOYAGES may use these details to
                    respond to my enquiry, as described in the{" "}
                    <Link
                        href="/privacy"
                        className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-gold-readable"
                    >
                        Privacy Policy
                    </Link>.
                </span>
            </label>

            {error && (
                <p className="text-xs text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}


function FieldInput({
                        field,
                        register,
                        error,
                        min,
                    }: {
    field: Field;
    register: UseFormRegister<FormValues>;
    error?: string;
    min?: string;
}) {
    const id = `enquiry-${field.name}`;
    const errorId = `${id}-error`;

    const commonProps = {
        id,
        ...register(field.name),
        "aria-invalid": !!error,
        "aria-required": field.required || undefined,
        "aria-describedby": error ? errorId : undefined,
        placeholder: field.placeholder,
    };

    return (
        <div
            className={
                field.full || field.type === "textarea"
                    ? "sm:col-span-2"
                    : ""
            }
        >
            <label
                htmlFor={id}
                className="eyebrow mb-2 block text-primary/80"
            >
                {field.label}

                {field.required && (
                    <span className="ml-1 text-gold-readable" aria-hidden="true">
            *
          </span>
                )}
            </label>

            {field.type === "textarea" ? (
                <Textarea
                    {...commonProps}
                    rows={5}
                    className="min-h-32 resize-y rounded-sm border-input bg-card/60 text-base placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-gold"
                />
            ) : field.type === "select" ? (
                <select
                    {...commonProps}
                    className={`${fieldClass} border px-3`}
                >
                    <option value="">Select an option</option>

                    {field.options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <Input
                    {...commonProps}
                    type={field.type}
                    min={
                        field.type === "number"
                            ? 0
                            : field.type === "date"
                                ? min
                                : undefined
                    }
                    className={fieldClass}
                />
            )}

            {error && (
                <p
                    id={errorId}
                    className="mt-1.5 text-xs text-destructive"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}


