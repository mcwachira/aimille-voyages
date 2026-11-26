import { describe, expect, it } from "vitest";

import { getActiveDashboardHref } from "./navigation";

const hrefs = ["/dashboard", "/dashboard/content", "/dashboard/content/destinations"];

describe("getActiveDashboardHref", () => {
    it("selects the deepest matching section for nested content routes", () => {
        expect(getActiveDashboardHref("/dashboard/content/destinations/abc", hrefs))
            .toBe("/dashboard/content/destinations");
    });

    it("does not mark the overview active for a different dashboard route", () => {
        expect(getActiveDashboardHref("/dashboard/enquiries", hrefs)).toBeNull();
    });

    it("selects exact overview routes", () => {
        expect(getActiveDashboardHref("/dashboard", hrefs)).toBe("/dashboard");
    });
});
