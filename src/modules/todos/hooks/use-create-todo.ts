import toast from "react-hot-toast";

import { api } from "~/utils/api";
import { generateRandomId } from "~/utils/helpers";

export function useCreateTodo() {
  const ctx = api.useContext();

  return api.todos.create.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await ctx.todos.getAll.cancel();

      // Snapshot the previous value
      const previousTodos = ctx.todos.getAll.getData();

      // Optimistically update to the new value
      ctx.todos.getAll.setData(undefined, (old) => [
        {
          id: generateRandomId(),
          text: input.text,
          authorId: generateRandomId(),
          status: "ACTIVE",
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...(old || []),
      ]);

      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, input, context) => {
      ctx.todos.getAll.setData(undefined, context?.previousTodos);

      console.log(err.data);

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
