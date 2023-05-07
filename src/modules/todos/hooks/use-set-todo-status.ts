import toast from "react-hot-toast";

import { api } from "~/utils/api";

import {
  cancelOutgoingRefetches,
  getPreviousCacheValues,
  refetch,
  rollBack,
} from "./utils";

export function useSetTodoStatus() {
  const ctx = api.useContext();

  return api.todos.setStatus.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await cancelOutgoingRefetches(ctx);

      // Snapshot the previous value
      const { allPreviousTodos, activePreviousTodos, completedPreviousTodos } =
        getPreviousCacheValues(ctx);

      // Optimistically update to the new value
      ctx.todos.getAll.setData({}, (old) => {
        if (!old) {
          return [];
        }

        return old.map((todo) => {
          if (todo.id === input.id) {
            return { ...todo, status: input.status };
          }
          return todo;
        });
      });

      ctx.todos.getAll.setData({ status: "ACTIVE" }, (old) => {
        if (!old) {
          return [];
        }

        // If the new status is COMPLETED, we need to delete the item from the list
        if (input.status === "COMPLETED") {
          return old.filter((todo) => todo.id === input.id);
        }

        // If the new status is ACTIVE, we need to get the updated todo from the list of all todos and push it to the list
        if (input.status === "ACTIVE") {
          const updatedTodo = allPreviousTodos?.find(
            (todo) => todo.id === input.id
          );

          if (!updatedTodo) {
            return old;
          }

          return [{ ...updatedTodo, status: "ACTIVE" }, ...old];
        }
      });

      ctx.todos.getAll.setData({ status: "COMPLETED" }, (old) => {
        if (!old) {
          return [];
        }

        // If the new status is ACTIVE, we need to delete the item from the list
        if (input.status === "ACTIVE") {
          return old.filter((todo) => todo.id === input.id);
        }

        // If the new status is COMPLETED, we need to get the updated todo from the list of all todos and push it to the list
        if (input.status === "COMPLETED") {
          const updatedTodo = allPreviousTodos?.find(
            (todo) => todo.id === input.id
          );

          if (!updatedTodo) {
            return old;
          }

          return [{ ...updatedTodo, status: "COMPLETED" }, ...old];
        }
      });

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
        "Failed to set todo status! Please try again later";

      toast.error(errorMessage);
    },
    // Always refetch after error or success:
    onSettled: () => refetch(ctx),
  });
}
