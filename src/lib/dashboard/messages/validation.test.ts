import { describe, expect, it } from "vitest";

import { conversationNoteSchema } from "./validation";

describe("conversationNoteSchema", () => {
    it("requires a valid conversation id and non-empty note", () => {
        expect(conversationNoteSchema.safeParse({
            conversationId: "not-a-uuid",
            note: "   ",
        }).success).toBe(false);
    });

    it("trims and accepts a valid note", () => {
        expect(conversationNoteSchema.parse({
            conversationId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            note: "  Call customer tomorrow.  ",
        }).note).toBe("Call customer tomorrow.");
    });

    it("rejects notes longer than 5000 characters", () => {
        expect(conversationNoteSchema.safeParse({
            conversationId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            note: "a".repeat(5001),
        }).success).toBe(false);
    });
});
