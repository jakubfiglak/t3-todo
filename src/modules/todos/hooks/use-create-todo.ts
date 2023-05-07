import type { Todo } from "@prisma/client";
import toast from "react-hot-toast";

import { api } from "~/utils/api";
import { generateRandomId } from "~/utils/helpers";

export function useCreateTodo() {
  const ctx = api.useContext();

  return api.todos.create.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await ctx.todos.getAll.cancel({});
      await ctx.todos.getAll.cancel({ status: "ACTIVE" });
      await ctx.todos.getAll.cancel({ status: "COMPLETED" });

      // Snapshot the previous value
      const allPreviousTodos = ctx.todos.getAll.getData({});
      const activePreviousTodos = ctx.todos.getAll.getData({
        status: "ACTIVE",
      });

      // Optimistically update to the new value
      const newTodo: Todo = {
        id: generateRandomId(),
        text: input.text,
        authorId: generateRandomId(),
        status: "ACTIVE",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ctx.todos.getAll.setData({}, (old) => [newTodo, ...(old || [])]);
      ctx.todos.getAll.setData({ status: "ACTIVE" }, (old) => [
        newTodo,
        ...(old || []),
      ]);

      return { allPreviousTodos, activePreviousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, input, context) => {
      ctx.todos.getAll.setData({}, context?.allPreviousTodos);
      ctx.todos.getAll.setData(
        { status: "ACTIVE" },
        context?.activePreviousTodos
      );

      const errorMessage =
        err.data?.zodError?.fieldErrors.text?.[0] ||
        "Failed to create todo! Please try again later";

      toast.error(errorMessage);
    },
    // Always refetch after error or success:
    onSettled: () => {
      void ctx.todos.getAll.invalidate({});
      void ctx.todos.getAll.invalidate({ status: "ACTIVE" });
    },
  });
}
