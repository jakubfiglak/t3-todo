import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Todos: NextPage = () => {
  const { data } = api.todos.getAll.useQuery();

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
            console.log(e);
          }}
          className="mb-4"
        >
          <input
            type="text"
            placeholder="Create a new todo..."
            className="w-full rounded-md px-5 py-3"
          />
        </form>
        <ul className="divide-y rounded-md bg-white shadow-lg">
          {data?.map((todo) => (
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
