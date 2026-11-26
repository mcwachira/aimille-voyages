import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdmin } from "@/lib/auth/require-admin";

import { markConversationRead } from "./actions";

vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function form(conversationId: string) {
    const data = new FormData();
    data.set("conversationId", conversationId);
    return data;
}

describe("markConversationRead", () => {
    let currentClient: unknown;

    beforeEach(() => {
        vi.clearAllMocks();
        currentClient = null;
        vi.mocked(requireAdmin).mockImplementation(async () => ({
            supabase: currentClient,
            user: { id: "staff-id" },
        }) as never);
    });

    it("validates the conversation id before accessing Supabase", async () => {
        const result = await markConversationRead({ status: "idle", message: "" }, form("not-a-uuid"));
        expect(result.status).toBe("error");
        expect(requireAdmin).not.toHaveBeenCalled();
    });

    it("marks a visible unread conversation as read and revalidates its views", async () => {
        const id = "8db02441-1bcf-4d5c-9795-343d508cdd44";
        const currentConversation = vi.fn().mockResolvedValue({ data: { id, unread: true }, error: null });
        const lookupEq = vi.fn(() => ({ maybeSingle: currentConversation }));
        const select = vi.fn(() => ({ eq: lookupEq }));
        const updatedConversation = vi.fn().mockResolvedValue({ data: { id }, error: null });
        const updateSelect = vi.fn(() => ({ maybeSingle: updatedConversation }));
        const updateEq = vi.fn(() => ({ select: updateSelect }));
        const update = vi.fn(() => ({ eq: updateEq }));
        const client = {
            from: vi.fn(() => ({ select, update })),
        };
        currentClient = client;

        const result = await markConversationRead({ status: "idle", message: "" }, form(id));

        expect(result).toEqual({ status: "success", message: "Conversation marked as read." });
        expect(update).toHaveBeenCalledWith({ unread: false });
        expect(updateEq).toHaveBeenCalledWith("id", id);
    });

    it("does not update when the conversation is already read", async () => {
        const id = "8db02441-1bcf-4d5c-9795-343d508cdd44";
        const currentConversation = vi.fn().mockResolvedValue({ data: { id, unread: false }, error: null });
        const update = vi.fn();
        const client = {
            from: vi.fn(() => ({ select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: currentConversation })) })), update })),
        };
        currentClient = client;

        const result = await markConversationRead({ status: "idle", message: "" }, form(id));

        expect(result.status).toBe("success");
        expect(update).not.toHaveBeenCalled();
    });

    it("rejects direct mutation calls from non-admin users", async () => {
        vi.mocked(requireAdmin).mockRejectedValue(new Error("forbidden"));
        const result = await markConversationRead(
            { status: "idle", message: "" },
            form("8db02441-1bcf-4d5c-9795-343d508cdd44"),
        );
        expect(result.status).toBe("error");
        expect(currentClient).toBeNull();
    });
});
