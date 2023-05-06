import { TRPCError } from "@trpc/server";

import {
  createTodoInput,
  hideTodoInput,
  setTodoStatusInput,
} from "~/modules/todos/schemas";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const todosRouter = createTRPCRouter({
  create: privateProcedure.input(createTodoInput).mutation(({ ctx, input }) => {
    return ctx.prisma.todo.create({
      data: {
        text: input.text,
        authorId: ctx.userId,
      },
    });
  }),
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: { authorId: { equals: ctx.userId }, isVisible: true },
      orderBy: { createdAt: "desc" },
    });
  }),
  setStatus: privateProcedure
    .input(setTodoStatusInput)
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo to update not found",
        });
      }

      if (todo.authorId !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot perform this action",
        });
      }

      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
      });
    }),
  hide: privateProcedure
    .input(hideTodoInput)
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo to update not found",
        });
      }

      if (todo.authorId !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot perform this action",
        });
      }

      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: { isVisible: false },
      });
    }),
});
