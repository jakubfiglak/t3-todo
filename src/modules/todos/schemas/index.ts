import { z } from "zod";

export const createTodoInput = z.object({
  text: z
    .string()
    .min(1, { message: "Todo text must be at least 1 character long" })
    .max(250, { message: "Todo text must not be longer than 250 characters" }),
});

export type CreateTodoInput = z.infer<typeof createTodoInput>;
