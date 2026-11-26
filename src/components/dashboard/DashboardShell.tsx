"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
    Activity,
    Bell,
    BookOpenText,
    BriefcaseBusiness,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    Compass,
    FileText,
    LayoutDashboard,
    LifeBuoy,
    Menu,
    MessageSquareText,
    Search,
    Settings2,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";

import { LogoutButton } from "@/app/dashboard/LogoutButton";
import { cn } from "cn";
import { getActiveDashboardHref } from "@/lib/dashboard/navigation";

const navigation = [
    {
        label: "Workspace",
        items: [
            { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
            { label: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquareText },
            { label: "Bookings & Trips", href: "/dashboard/bookings", icon: BriefcaseBusiness },
            { label: "Customers", href: "/dashboard/customers", icon: Users },
            { label: "Messages", href: "/dashboard/messages", icon: MessageSquareText },
        ],
    },
    {
        label: "Website content",
        items: [
            { label: "Content overview", href: "/dashboard/content", icon: BookOpenText },
            { label: "Destinations", href: "/dashboard/content/destinations", icon: Compass },
            { label: "Experiences", href: "/dashboard/content/experiences", icon: LifeBuoy },
            { label: "Services", href: "/dashboard/content/services", icon: BriefcaseBusiness },
            { label: "Packages", href: "/dashboard/content/packages", icon: BookOpenText },
            { label: "Articles", href: "/dashboard/content/articles", icon: FileText },
            { label: "Guides", href: "/dashboard/content/guides", icon: CircleHelp },
        ],
    },
    {
        label: "Administration",
        items: [
            { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
            { label: "Activity", href: "/dashboard/activity", icon: Activity },
            { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
            { label: "Staff access", href: "/dashboard/staff", icon: ShieldCheck },
        ],
    },
];

function NavContents({
    pathname,
    collapsed,
    onNavigate,
}: {
    pathname: string;
    collapsed: boolean;
    onNavigate?: () => void;
}) {
    const activeHref = getActiveDashboardHref(pathname, navigation.flatMap((group) => group.items.map(({ href }) => href)));
    return (
        <nav aria-label="Dashboard navigation" className="space-y-7">
            {navigation.map((group) => (
                <div key={group.label}>
                    {!collapsed ? (
                        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-sidebar-foreground/55">
                            {group.label}
                        </p>
                    ) : null}
                    <ul className="space-y-1">
                        {group.items.map(({ label, href, icon: Icon }) => {
                            const active = activeHref === href;
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        aria-current={active ? "page" : undefined}
                                        title={collapsed ? label : undefined}
                                        onClick={onNavigate}
                                        className={cn(
                                            "flex min-h-10 items-center gap-3 border-l-2 px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                                            collapsed && "justify-center px-2",
                                            active
                                                ? "border-gold bg-sidebar-accent text-sidebar-accent-foreground"
                                                : "border-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                                        {!collapsed ? <span className="truncate">{label}</span> : null}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}

export function DashboardShell({ children, userEmail }: { children: React.ReactNode; userEmail: string | null }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);
    const mobilePanelRef = useRef<HTMLElement>(null);
    const wasMobileOpenRef = useRef(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const activeHref = getActiveDashboardHref(pathname, navigation.flatMap((group) => group.items.map(({ href }) => href)));
    const currentPage = navigation.flatMap((group) => group.items).find(({ href }) => href === activeHref)?.label ?? "Workspace";
    const searchResults = navigation.flatMap((group) => group.items).filter(({ label }) =>
        label.toLowerCase().includes(searchValue.trim().toLowerCase()),
    );

    useEffect(() => {
        if (mobileOpen) {
            wasMobileOpenRef.current = true;
            const panel = mobilePanelRef.current;
            const focusable = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
            focusable?.[0]?.focus();
            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    setMobileOpen(false);
                    return;
                }
                if (event.key !== "Tab" || !focusable?.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            };
            document.addEventListener("keydown", onKeyDown);
            return () => document.removeEventListener("keydown", onKeyDown);
        }
        if (wasMobileOpenRef.current) {
            wasMobileOpenRef.current = false;
            mobileTriggerRef.current?.focus();
        }
    }, [mobileOpen]);

    return (
        <div className="min-h-dvh bg-background text-foreground">
            <div className="flex min-h-dvh">
                <aside
                    className={cn(
                        "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
                        collapsed ? "w-[5.25rem]" : "w-64 xl:w-72",
                    )}
                >
                    <div className={cn("flex h-[4.5rem] items-center border-b border-sidebar-border px-5", collapsed && "justify-center px-2")}>
                        <Link href="/dashboard" aria-label="AIMILLE VOYAGES dashboard" className="min-w-0">
                            {collapsed ? (
                                <span className="font-serif text-xl text-gold-readable">A</span>
                            ) : (
                                <span className="block truncate font-serif text-lg leading-none tracking-wide">AIMILLE <span className="text-gold-readable">VOYAGES</span></span>
                            )}
                            {!collapsed ? <span className="mt-1 block text-[9px] uppercase tracking-[0.24em] text-sidebar-foreground/55">Staff workspace</span> : null}
                        </Link>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
                        <NavContents pathname={pathname} collapsed={collapsed} />
                    </div>
                    <div className="border-t border-sidebar-border p-3">
                        <button
                            type="button"
                            onClick={() => setCollapsed((value) => !value)}
                            className={cn("flex min-h-10 w-full items-center gap-3 px-3 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground", collapsed && "justify-center px-2")}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? <ChevronRight className="size-4" /> : <><ChevronLeft className="size-4" /><span>Collapse navigation</span></>}
                        </button>
                    </div>
                </aside>

                {mobileOpen ? (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button className="absolute inset-0 bg-black/45" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
                        <aside id="dashboard-mobile-navigation" ref={mobilePanelRef} role="dialog" aria-modal="true" aria-label="Dashboard navigation" className="relative flex h-full w-[min(19rem,88vw)] flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl">
                            <div className="flex h-[4.5rem] items-center justify-between border-b border-sidebar-border px-5">
                                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="font-serif text-lg tracking-wide">AIMILLE <span className="text-gold-readable">VOYAGES</span></Link>
                                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="rounded-sm p-2 hover:bg-sidebar-accent"><X className="size-5" /></button>
                            </div>
                            <div className="px-3 py-6"><NavContents pathname={pathname} collapsed={false} onNavigate={() => setMobileOpen(false)} /></div>
                        </aside>
                    </div>
                ) : null}

                <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button ref={mobileTriggerRef} type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="dashboard-mobile-navigation" className="rounded-sm p-2 hover:bg-muted lg:hidden"><Menu className="size-5" /></button>
                            <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground sm:flex">
                                <span className="truncate">Workspace</span><span aria-hidden="true">/</span><span className="truncate text-foreground">{currentPage}</span>
                            </div>
                            <span className="truncate text-sm text-foreground sm:hidden">{currentPage}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                            <button type="button" aria-label="Search dashboard navigation" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)} className="rounded-sm p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Search className="size-4" /></button>
                            <Link href="/dashboard/notifications" aria-label="Notifications" className="rounded-sm p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Bell className="size-4" /></Link>
                            <details className="group relative">
                                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-gold">
                                    <span className="grid size-7 place-items-center bg-jungle text-xs font-medium uppercase text-ivory">{userEmail?.slice(0, 1) || "A"}</span>
                                    <span className="hidden max-w-32 truncate sm:inline">{userEmail || "Account"}</span><ChevronDown className="hidden size-3 sm:block" />
                                </summary>
                                <div className="absolute right-0 top-full z-40 mt-2 w-56 border border-border bg-popover p-3 text-popover-foreground shadow-xl">
                                    {userEmail ? <p className="break-all px-2 pb-2 text-xs text-muted-foreground">Signed in as {userEmail}</p> : null}
                                    <Link href="/dashboard/settings" className="block px-2 py-2 text-sm hover:bg-muted">Workspace settings</Link>
                                    <div className="mt-2 border-t border-border pt-3"><LogoutButton /></div>
                                </div>
                            </details>
                        </div>
                    </header>
                    {searchOpen ? (
                        <div className="absolute right-4 top-[4rem] z-40 w-[min(24rem,calc(100vw-2rem))] border border-border bg-popover p-4 shadow-xl sm:right-8" role="search">
                            <label htmlFor="dashboard-nav-search" className="text-xs font-medium text-muted-foreground">Find a workspace section</label>
                            <input id="dashboard-nav-search" autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search sections…" className="mt-2 h-10 w-full border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            <ul className="mt-2 max-h-64 overflow-y-auto">
                                {searchResults.map((item) => <li key={item.href}><Link href={item.href} onClick={() => { setSearchOpen(false); setSearchValue(""); }} className="block px-3 py-2 text-sm hover:bg-muted">{item.label}</Link></li>)}
                                {searchResults.length === 0 ? <li className="px-3 py-2 text-sm text-muted-foreground">No sections found.</li> : null}
                            </ul>
                        </div>
                    ) : null}
                    <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
                        <div className="mx-auto w-full max-w-[100rem]">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
