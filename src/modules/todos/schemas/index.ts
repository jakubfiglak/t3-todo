import { TodoStatus } from "@prisma/client";
import { z } from "zod";

export const createTodoInput = z.object({
  text: z
    .string()
    .min(1, { message: "Todo text must be at least 1 character long" })
    .max(250, { message: "Todo text must not be longer than 250 characters" }),
});

export const getAllTodosInput = z.object({
  status: z.nativeEnum(TodoStatus).optional(),
});

export const setTodoStatusInput = z.object({
  id: z.string().cuid2(),
  status: z.nativeEnum(TodoStatus),
});

export const hideTodoInput = z.object({
  id: z.string().cuid2(),
});

export type CreateTodoInput = z.infer<typeof createTodoInput>;
export type GetAllTodosInput = z.infer<typeof getAllTodosInput>;
