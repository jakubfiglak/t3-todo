import type { Todo } from "@prisma/client";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

import {
  cancelOutgoingRefetches,
  getPreviousCacheValues,
  refetch,
  rollBack,
} from "./utils";

export function useHideTodo() {
  const ctx = api.useContext();

  return api.todos.hide.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await cancelOutgoingRefetches(ctx);

      // Snapshot the previous value
      const { allPreviousTodos, activePreviousTodos, completedPreviousTodos } =
        getPreviousCacheValues(ctx);

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
    onError: (err, _input, context) => {
      rollBack(ctx, {
        all: context?.allPreviousTodos,
        active: context?.activePreviousTodos,
        completed: context?.completedPreviousTodos,
      });

      const errorMessage =
        err.data?.zodError?.fieldErrors.text?.[0] ||
        "Failed to hide todo! Please try again later";

      toast.error(errorMessage);
    },
    // Always refetch after error or success:
    onSettled: () => refetch(ctx),
  });
}
