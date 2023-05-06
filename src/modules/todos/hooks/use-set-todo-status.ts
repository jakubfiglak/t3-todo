import toast from "react-hot-toast";

import { api } from "~/utils/api";

export function useSetTodoStatus() {
  const ctx = api.useContext();

  return api.todos.setStatus.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await ctx.todos.getAll.cancel();

      // Snapshot the previous value
      const previousTodos = ctx.todos.getAll.getData();

      // Optimistically update to the new value
      ctx.todos.getAll.setData(undefined, (old) => {
        return (old || []).map((todo) => {
          if (todo.id === input.id) {
            return { ...todo, status: input.status };
          }
          return todo;
        });
      });

      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, input, context) => {
      ctx.todos.getAll.setData(undefined, context?.previousTodos);

      const errorMessage =
        err.data?.zodError?.fieldErrors.text?.[0] ||
        "Failed to create todo! Please try again later";

      toast.error(errorMessage);
    },
    // Always refetch after error or success:
    onSettled: () => {
      void ctx.todos.getAll.invalidate();
    },
  });
}
