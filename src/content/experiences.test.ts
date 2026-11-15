import { describe, expect, it } from "vitest";
import { EXPERIENCES, verifiedDuration } from "./experiences";

describe("experience durations", () => {
    it("is hidden when no duration is given", () => {
        expect(verifiedDuration({})).toBeUndefined();
    });

    it("is hidden when a duration exists but is not verified", () => {
        expect(verifiedDuration({ duration: "Half day" })).toBeUndefined();
        expect(verifiedDuration({ duration: "Half day", durationVerified: false })).toBeUndefined();
    });

    it("is shown when provided and verified", () => {
        expect(verifiedDuration({ duration: "Half day", durationVerified: true })).toBe("Half day");
    });

    it("blank durations are never shown", () => {
        expect(verifiedDuration({ duration: "  ", durationVerified: true })).toBeUndefined();
    });

    it("no current experience shows an unconfirmed duration", () => {
        expect(EXPERIENCES.every((e) => verifiedDuration(e) === undefined)).toBe(true);
    });
});