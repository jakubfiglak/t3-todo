import type { TodoStatus } from "@prisma/client";
import { useRouter } from "next/router";

import { Spinner } from "~/components/Spinner";

import { StatusSelect, TodoForm, TodoItem } from "../components";
import {
  useCreateTodo,
  useHideCompleted,
  useHideTodo,
  useSetTodoStatus,
  useTodos,
} from "../hooks";

type TodosViewProps = {
  className?: string;
};

export const TodosView = ({ className }: TodosViewProps) => {
  const router = useRouter();

  const todos = useTodos(router.query.status as TodoStatus);
  const createTodo = useCreateTodo();
  const setTodoStatus = useSetTodoStatus();
  const hideTodo = useHideTodo();
  const hideCompleted = useHideCompleted();

  return (
    <div className={className}>
      <TodoForm onSubmit={(data) => createTodo.mutate(data)} className="mb-4" />
      {todos.isLoading ? (
        <Spinner size={40} className="mt-32 flex justify-center" />
      ) : (
        <div>
          {todos.data && todos.data.length > 0 && (
            <ul className="divide-y divide-light-steel-blue overflow-hidden rounded-t-md dark:divide-dark-slate-blue">
              {todos.data.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onCheckboxChange={() =>
                    setTodoStatus.mutate({
                      id: todo.id,
                      status: todo.status === "ACTIVE" ? "COMPLETED" : "ACTIVE",
                    })
                  }
                  onHideButtonClick={() => hideTodo.mutate({ id: todo.id })}
                />
              ))}
            </ul>
          )}
          <footer>
            <div className="mb-4 flex items-center justify-between rounded-b-md border-t border-light-steel-blue bg-white px-5 pb-5 pt-4 text-grayish-blue shadow-md dark:border-dark-slate-blue dark:bg-cherywood">
              <span>
                {todos.data?.filter((todo) => todo.status === "ACTIVE")
                  .length || 0}{" "}
                items left
              </span>
              <StatusSelect className="hidden md:flex" />
              <button
                className="transition-colors hover:text-gunmetal dark:hover:text-light-steel-blue"
                onClick={() => hideCompleted.mutate()}
              >
                Clear Completed
              </button>
            </div>
          </footer>
          <nav className="flex items-center justify-center rounded-md bg-white py-4 shadow-md dark:bg-cherywood md:hidden">
            <StatusSelect />
          </nav>
        </div>
      )}
    </div>
  );
};
