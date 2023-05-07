import toast from "react-hot-toast";

import { api } from "~/utils/api";

import {
  buildTodo,
  cancelOutgoingRefetches,
  getPreviousCacheValues,
  refetch,
  rollBack,
} from "./utils";

export function useCreateTodo() {
  const ctx = api.useContext();

  return api.todos.create.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await cancelOutgoingRefetches(ctx);

      // Snapshot the previous value
      const { allPreviousTodos, activePreviousTodos } =
        getPreviousCacheValues(ctx);

      // Optimistically update to the new value
      const newTodo = buildTodo(input.text);

      ctx.todos.getAll.setData({}, (old) => [newTodo, ...(old || [])]);
      ctx.todos.getAll.setData({ status: "ACTIVE" }, (old) => [
        newTodo,
        ...(old || []),
      ]);

      return { allPreviousTodos, activePreviousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, _input, context) => {
      rollBack(ctx, {
        all: context?.allPreviousTodos,
        active: context?.activePreviousTodos,
      });

      const errorMessage =
        err.data?.zodError?.fieldErrors.text?.[0] ||
        "Failed to create todo! Please try again later";

      toast.error(errorMessage);
    },
    // Always refetch after error or success:
    onSettled: () => refetch(ctx),
  });
}
