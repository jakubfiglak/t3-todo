import type { Todo } from "@prisma/client";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

export function useHideTodo() {
  const ctx = api.useContext();

  return api.todos.hide.useMutation({
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
      const completedPreviousTodos = ctx.todos.getAll.getData({
        status: "COMPLETED",
      });

      // Optimistically update to the new value
      function updateTodosList(todos?: Todo[]) {
        return (todos || []).filter((todo) => todo.id !== input.id);
      }

      ctx.todos.getAll.setData({}, (old) => updateTodosList(old));
      ctx.todos.getAll.setData({ status: "ACTIVE" }, (old) =>
        updateTodosList(old)
      );
      ctx.todos.getAll.setData({ status: "COMPLETED" }, (old) =>
        updateTodosList(old)
      );

      return { allPreviousTodos, activePreviousTodos, completedPreviousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, input, context) => {
      ctx.todos.getAll.setData({}, context?.allPreviousTodos);
      ctx.todos.getAll.setData(
        { status: "ACTIVE" },
        context?.activePreviousTodos
      );
      ctx.todos.getAll.setData(
        { status: "COMPLETED" },
        context?.completedPreviousTodos
      );

      const errorMessage =
        err.data?.zodError?.fieldErrors.text?.[0] ||
        "Failed to hide todo! Please try again later";

      toast.error(errorMessage);
    },
    // Always refetch after error or success:
    onSettled: () => {
      void ctx.todos.getAll.invalidate({});
      void ctx.todos.getAll.invalidate({ status: "ACTIVE" });
      void ctx.todos.getAll.invalidate({ status: "COMPLETED" });
    },
  });
}
