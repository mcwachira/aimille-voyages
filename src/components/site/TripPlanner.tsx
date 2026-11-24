
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { submitEnquiry } from "@/app/actions/submit-enquiry";
import { DESTINATIONS } from "@/content/destinations";
import { SUPPLIER_NOTE } from "@/content/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { ConsentRow, fieldClass } from "./EnquiryForm";
import { EnquirySuccess } from "./EnquirySuccess";

const PLANNING = [
    "Bespoke holiday",
    "Accommodation",
    "Airport transfers and transportation",
    "Experiences and excursions",
    "Long-stay concierge",
    "Corporate travel",
    "Group travel",
    "Other concierge assistance",
];

const STYLES = [
    "Relaxed",
    "Adventurous",
    "Romantic",
    "Family-focused",
    "Cultural",
    "Luxury",
    "Still deciding",
];

const ACCOM = [
    "Hotel",
    "Boutique",
    "Serviced apartment",
    "Private villa / house",
    "Lodge / camp",
    "Open to suggestions",
];

const CURRENCIES = ["USD", "EUR", "GBP", "KES"];

const STEPS = [
    "About you",
    "Your plans",
    "Travel details",
    "Preferences",
    "Review",
];

type PlannerState = {
    name: string;
    email: string;
    country: string;
    phone: string;
    services: string[];
    destination: string;
    arrival: string;
    departure: string;
    adults: string;
    children: string;
    accommodation: string;
    flexible: boolean;
    budget: string;
    currency: string;
    style: string;
    preferences: string;
    notes: string;
    exploring: boolean;
};

const initialState: PlannerState = {
    name: "",
    email: "",
    country: "",
    phone: "",
    services: [],
    destination: "",
    arrival: "",
    departure: "",
    adults: "2",
    children: "0",
    accommodation: "",
    flexible: false,
    budget: "",
    currency: "USD",
    style: "",
    preferences: "",
    notes: "",
    exploring: false,
};

function getLocalDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function TripPlanner() {
    const [step, setStep] = useState(0);
    const [s, setS] = useState<PlannerState>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [consent, setConsent] = useState(false);
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const today = getLocalDate();

    const up = <K extends keyof PlannerState>(
        key: K,
        value: PlannerState[K],
    ) => {
        setS((previous) => ({
            ...previous,
            [key]: value,
        }));

        setErrors((previous) => {
            if (!previous[key]) return previous;

            const updated = { ...previous };
            delete updated[key];

            return updated;
        });
    };

    function validate(currentStep: number) {
        const validationErrors: Record<string, string> = {};

        if (currentStep === 0) {
            if (!s.name.trim()) {
                validationErrors.name = "Please enter your full name";
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) {
                validationErrors.email = "Please enter a valid email address";
            }
        }

        if (currentStep === 1 && s.services.length === 0) {
            validationErrors.services = "Please choose at least one option";
        }

        if (currentStep === 2) {
            const adults = Number(s.adults);
            const children = Number(s.children);

            if (
                !s.adults.trim() ||
                !Number.isInteger(adults) ||
                adults < 0
            ) {
                validationErrors.adults = "Please enter a valid number of adults";
            }

            if (
                !s.children.trim() ||
                !Number.isInteger(children) ||
                children < 0
            ) {
                validationErrors.children = "Please enter a valid number of children";
            }

            if (!s.flexible) {
                if (s.arrival && s.arrival < today) {
                    validationErrors.arrival = "Arrival date cannot be in the past";
                }

                if (s.arrival && s.departure && s.departure < s.arrival) {
                    validationErrors.departure =
                        "Departure cannot be earlier than arrival";
                }

                if (s.departure && !s.arrival) {
                    validationErrors.arrival =
                        "Please select an arrival date or mark your dates as flexible";
                }
            }
        }

        setErrors((previous) => {
            const updated = { ...previous };

            Object.keys(updated).forEach((key) => {
                if (
                    currentStep === 0 &&
                    ["name", "email"].includes(key)
                ) {
                    delete updated[key];
                }

                if (currentStep === 1 && key === "services") {
                    delete updated[key];
                }

                if (
                    currentStep === 2 &&
                    ["arrival", "departure", "adults", "children"].includes(key)
                ) {
                    delete updated[key];
                }
            });

            return { ...updated, ...validationErrors };
        });

        return Object.keys(validationErrors).length === 0;
    }

    function next() {
        if (validate(step)) {
            setStep((current) => Math.min(current + 1, 4));
        }
    }

    function back() {
        setErrors({});
        setStep((current) => Math.max(current - 1, 0));
    }

    function goTo(index: number) {
        setErrors({});
        setStep(index);
    }

    async function send() {
        if (sending) return;

        for (let index = 0; index < 4; index++) {
            if (!validate(index)) {
                setStep(index);
                return;
            }
        }

        if (!consent) {
            setErrors((previous) => ({
                ...previous,
                consent: "Please accept the privacy notice",
            }));

            return;
        }

        setSending(true);
        setServerError(null);

        try {
            // Pass the enquiry object directly.
            // The Server Action validates this object using enquirySchema.
            const result = await submitEnquiry({
                category: "trip_planner",
                client_name: s.name.trim(),
                email: s.email.trim(),
                phone: s.phone,
                country: s.country,
                services: s.services,
                destination: s.destination,
                arrival_date: s.flexible ? "" : s.arrival,
                departure_date: s.flexible ? "" : s.departure,
                dates_flexible: s.flexible,
                adults: Number(s.adults),
                children: Number(s.children),
                budget: s.exploring ? "Still exploring" : s.budget,
                currency: s.exploring ? undefined : s.currency,
                preferences: [
                    s.style && `Travel style: ${s.style}`,
                    s.preferences,
                ]
                    .filter(Boolean)
                    .join("\n"),
                notes: s.notes,
                details: s.accommodation
                    ? {
                        "Preferred accommodation": s.accommodation,
                    }
                    : {},
                source_page: "/plan-your-trip",
                consent: true,
            });

            track("enquiry_submit", {
                category: "trip_planner",
                duplicate: result.duplicate,
            });

            setDone(true);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setSending(false);
        }
    }

    if (done) {
        return <EnquirySuccess whatsappTopic="planning a trip" />;
    }

    return (
        <div>
            <ol className="mb-12 grid grid-cols-5 gap-2" aria-label="Progress">
                {STEPS.map((title, index) => (
                    <li key={title}>
                        <button
                            type="button"
                            onClick={() => index < step && goTo(index)}
                            className={cn(
                                "w-full text-left",
                                index < step ? "cursor-pointer" : "cursor-default",
                            )}
                            aria-current={index === step ? "step" : undefined}
                            aria-label={`Step ${index + 1}: ${title}`}
                        >
              <span
                  className={cn(
                      "block h-px",
                      index <= step ? "bg-gold" : "bg-border",
                  )}
              />

                            <span
                                className={cn(
                                    "eyebrow mt-3 hidden md:block",
                                    index === step
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                )}
                            >
                0{index + 1} · {title}
              </span>
                        </button>
                    </li>
                ))}
            </ol>

            <p className="eyebrow mb-2 text-gold md:hidden">
                Step {step + 1} of 5 · {STEPS[step]}
            </p>

            <div
                key={step}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
                {step === 0 && (
                    <Grid title="Tell us a little about yourself.">
                        <F label="Full name" req error={errors.name}>
                            <Input
                                className={fieldClass}
                                value={s.name}
                                onChange={(event) => up("name", event.target.value)}
                                autoComplete="name"
                            />
                        </F>

                        <F label="Email address" req error={errors.email}>
                            <Input
                                type="email"
                                className={fieldClass}
                                value={s.email}
                                onChange={(event) => up("email", event.target.value)}
                                autoComplete="email"
                            />
                        </F>

                        <F label="Country of residence">
                            <Input
                                className={fieldClass}
                                value={s.country}
                                onChange={(event) => up("country", event.target.value)}
                                autoComplete="country-name"
                            />
                        </F>

                        <F label="WhatsApp or phone number">
                            <Input
                                type="tel"
                                className={fieldClass}
                                value={s.phone}
                                onChange={(event) => up("phone", event.target.value)}
                                autoComplete="tel"
                            />
                        </F>
                    </Grid>
                )}

                {step === 1 && (
                    <div>
                        <h2 className="text-3xl text-primary md:text-4xl">
                            What are you planning?
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Choose as many as you like.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            {PLANNING.map((option) => {
                                const selected = s.services.includes(option);

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                            up(
                                                "services",
                                                selected
                                                    ? s.services.filter((item) => item !== option)
                                                    : [...s.services, option],
                                            )
                                        }
                                        className={cn(
                                            "flex items-center justify-between border px-5 py-4 text-left transition-colors",
                                            selected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-card/60 hover:border-gold",
                                        )}
                                        aria-pressed={selected}
                                    >
                                        {option}

                                        {selected && (
                                            <Check className="h-4 w-4 text-gold" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {errors.services && (
                            <p className="mt-3 text-sm text-destructive">
                                {errors.services}
                            </p>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <Grid title="Where and when?">
                        <F label="Destination of interest">
                            <Input
                                list="dest-list"
                                className={fieldClass}
                                value={s.destination}
                                onChange={(event) => up("destination", event.target.value)}
                                placeholder="e.g. Maasai Mara & Diani, or not sure yet"
                            />

                            <datalist id="dest-list">
                                {DESTINATIONS.map((destination) => (
                                    <option
                                        key={destination.slug}
                                        value={destination.name}
                                    />
                                ))}
                            </datalist>
                        </F>

                        <F label="Preferred accommodation type">
                            <select
                                className={`${fieldClass} w-full border px-3`}
                                value={s.accommodation}
                                onChange={(event) =>
                                    up("accommodation", event.target.value)
                                }
                            >
                                <option value="">Select…</option>

                                {ACCOM.map((option) => (
                                    <option key={option}>{option}</option>
                                ))}
                            </select>
                        </F>

                        <label className="flex items-center gap-3 text-sm md:col-span-2">
                            <Checkbox
                                checked={s.flexible}
                                onCheckedChange={(value) =>
                                    up("flexible", value === true)
                                }
                            />

                            My dates aren&apos;t decided yet
                        </label>

                        {!s.flexible && (
                            <>
                                <F label="Arrival date" error={errors.arrival}>
                                    <Input
                                        type="date"
                                        min={today}
                                        className={fieldClass}
                                        value={s.arrival}
                                        onChange={(event) =>
                                            up("arrival", event.target.value)
                                        }
                                    />
                                </F>

                                <F label="Departure date" error={errors.departure}>
                                    <Input
                                        type="date"
                                        min={s.arrival || today}
                                        className={fieldClass}
                                        value={s.departure}
                                        onChange={(event) =>
                                            up("departure", event.target.value)
                                        }
                                    />
                                </F>
                            </>
                        )}

                        <F label="Adults" error={errors.adults}>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                className={fieldClass}
                                value={s.adults}
                                onChange={(event) => up("adults", event.target.value)}
                            />
                        </F>

                        <F label="Children" error={errors.children}>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                className={fieldClass}
                                value={s.children}
                                onChange={(event) => up("children", event.target.value)}
                            />
                        </F>
                    </Grid>
                )}

                {step === 3 && (
                    <Grid title="Budget and preferences.">
                        <label className="flex items-center gap-3 text-sm md:col-span-2">
                            <Checkbox
                                checked={s.exploring}
                                onCheckedChange={(value) =>
                                    up("exploring", value === true)
                                }
                            />

                            I&apos;m still exploring and haven&apos;t decided on a budget
                        </label>

                        {!s.exploring && (
                            <>
                                <F label="Estimated budget (optional)">
                                    <Input
                                        className={fieldClass}
                                        value={s.budget}
                                        onChange={(event) =>
                                            up("budget", event.target.value)
                                        }
                                        placeholder="Total, approximate"
                                    />
                                </F>

                                <F label="Currency">
                                    <select
                                        className={`${fieldClass} w-full border px-3`}
                                        value={s.currency}
                                        onChange={(event) =>
                                            up("currency", event.target.value)
                                        }
                                    >
                                        {CURRENCIES.map((currency) => (
                                            <option key={currency}>{currency}</option>
                                        ))}
                                    </select>
                                </F>
                            </>
                        )}

                        <F label="Travel style">
                            <select
                                className={`${fieldClass} w-full border px-3`}
                                value={s.style}
                                onChange={(event) => up("style", event.target.value)}
                            >
                                <option value="">Select…</option>

                                {STYLES.map((style) => (
                                    <option key={style}>{style}</option>
                                ))}
                            </select>
                        </F>

                        <F label="Special preferences" full>
                            <Textarea
                                rows={3}
                                className="rounded-sm bg-card/60"
                                value={s.preferences}
                                onChange={(event) =>
                                    up("preferences", event.target.value)
                                }
                                placeholder="Dietary needs, accessibility, interests…"
                            />
                        </F>

                        <F label="Additional requests" full>
                            <Textarea
                                rows={3}
                                className="rounded-sm bg-card/60"
                                value={s.notes}
                                onChange={(event) => up("notes", event.target.value)}
                            />
                        </F>
                    </Grid>
                )}

                {step === 4 && (
                    <div>
                        <h2 className="text-3xl text-primary md:text-4xl">
                            Review your enquiry.
                        </h2>

                        <div className="mt-8 divide-y divide-border border-y border-border">
                            <Row label="About you" onEdit={() => goTo(0)}>
                                {s.name} · {s.email}
                                {s.country && ` · ${s.country}`}
                                {s.phone && ` · ${s.phone}`}
                            </Row>

                            <Row label="Planning" onEdit={() => goTo(1)}>
                                {s.services.join(", ")}
                            </Row>

                            <Row label="Travel" onEdit={() => goTo(2)}>
                                {s.destination || "Destination open"} ·{" "}
                                {s.flexible
                                    ? "Dates flexible"
                                    : `${s.arrival || "—"} to ${s.departure || "—"}`}{" "}
                                · {s.adults} adults, {s.children} children
                                {s.accommodation && ` · ${s.accommodation}`}
                            </Row>

                            <Row label="Preferences" onEdit={() => goTo(3)}>
                                {s.exploring
                                    ? "Budget: still exploring"
                                    : s.budget
                                        ? `Budget: ${s.currency} ${s.budget}`
                                        : "No budget given"}
                                {s.style && ` · ${s.style}`}
                                {s.preferences && ` · ${s.preferences}`}
                                {s.notes && ` · ${s.notes}`}
                            </Row>
                        </div>

                        <div className="mt-8 space-y-4">
                            <ConsentRow
                                checked={consent}
                                onChange={(checked) => {
                                    setConsent(checked);

                                    if (checked) {
                                        setErrors((previous) => {
                                            const updated = { ...previous };
                                            delete updated.consent;
                                            return updated;
                                        });
                                    }
                                }}
                                error={errors.consent}
                            />

                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {SUPPLIER_NOTE}
                            </p>

                            {serverError && (
                                <p className="text-sm text-destructive" role="alert">
                                    {serverError}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={back}
                    disabled={sending}
                    className={step === 0 ? "invisible" : ""}
                >
                    Back
                </Button>

                {step < 4 ? (
                    <Button
                        type="button"
                        variant="brand"
                        size="xl"
                        onClick={next}
                        disabled={sending}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="brand"
                        size="xl"
                        onClick={send}
                        disabled={sending}
                    >
                        {sending && <Loader2 className="animate-spin" />}
                        {sending ? "Submitting..." : "Submit enquiry"}
                    </Button>
                )}
            </div>
        </div>
    );
}

function Grid({
                  title,
                  children,
              }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div>
            <h2 className="text-3xl text-primary md:text-4xl">{title}</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

function F({
               label,
               req,
               error,
               full,
               children,
           }: {
    label: string;
    req?: boolean;
    error?: string;
    full?: boolean;
    children: ReactNode;
}) {
    return (
        <div className={full ? "md:col-span-2" : ""}>
            <label className="eyebrow mb-2 block text-primary/80">
                {label} {req && <span className="text-gold">*</span>}
            </label>

            {children}

            {error && (
                <p className="mt-1.5 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

function Row({
                 label,
                 onEdit,
                 children,
             }: {
    label: string;
    onEdit: () => void;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2 py-5 md:flex-row md:items-start md:gap-8">
            <p className="eyebrow w-32 shrink-0 text-gold">{label}</p>

            <p className="flex-1 text-sm leading-relaxed">
                {children}
            </p>

            <button
                type="button"
                onClick={onEdit}
                className="eyebrow text-primary underline underline-offset-4"
            >
                Edit
            </button>
        </div>
    );
}
