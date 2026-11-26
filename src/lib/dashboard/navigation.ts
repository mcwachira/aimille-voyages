export function getActiveDashboardHref(pathname: string, hrefs: string[]) {
    return hrefs
        .filter((href) => pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)))
        .sort((left, right) => right.length - left.length)[0] ?? null;
}
