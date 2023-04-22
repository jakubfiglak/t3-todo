import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const todosRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ text: z.string().min(1).max(250) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          text: input.text,
          authorId: ctx.userId,
        },
      });
    }),
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: { authorId: { equals: ctx.userId } },
    });
  }),
});
