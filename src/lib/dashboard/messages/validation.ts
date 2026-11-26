import { z } from "zod";

export const conversationNoteSchema = z.object({
    conversationId: z.string().uuid(),
    note: z.string().trim().min(1, "Write a note before saving.").max(5000),
});

export type ConversationNoteInput = z.infer<typeof conversationNoteSchema>;
