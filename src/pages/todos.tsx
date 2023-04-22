import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { generateRandomId } from "~/utils/helpers";

const Todos: NextPage = () => {
  const ctx = api.useContext();

  const todos = api.todos.getAll.useQuery();
  const createTodo = api.todos.create.useMutation({
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await ctx.todos.getAll.cancel();

      // Snapshot the previous value
      const previousTodos = ctx.todos.getAll.getData();

      // Optimistically update to the new value
      ctx.todos.getAll.setData(undefined, (old) => [
        ...(old || []),
        {
          id: generateRandomId(),
          text: input.text,
          authorId: generateRandomId(),
          status: "ACTIVE",
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, input, context) => {
      ctx.todos.getAll.setData(undefined, context?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      void ctx.todos.getAll.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="h-[200px] bg-[url('/images/bg-mobile-light.jpg')] bg-cover px-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-widest text-white">
            TODO
          </h1>
          <span>🌕</span>
        </div>
      </header>
      <main className="-mt-20 px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            return createTodo.mutate({
              text: (e.target as unknown as { text: { value: string } }).text
                .value,
            });
          }}
          className="mb-4"
        >
          <input
            type="text"
            name="text"
            placeholder="Create a new todo..."
            className="w-full rounded-md px-5 py-3"
          />
        </form>
        <ul className="divide-y rounded-md bg-white shadow-lg">
          {todos.data?.map((todo) => (
            <li key={todo.id} className="px-5 py-4">
              {todo.text}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Todos;