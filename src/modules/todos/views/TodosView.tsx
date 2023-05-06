import { TodoForm, TodoItem } from "../components";
import {
  useCreateTodo,
  useHideTodo,
  useSetTodoStatus,
  useTodos,
} from "../hooks";

type TodosViewProps = {
  className?: string;
};

export const TodosView = ({ className }: TodosViewProps) => {
  const todos = useTodos();
  const createTodo = useCreateTodo();
  const setTodoStatus = useSetTodoStatus();
  const hideTodo = useHideTodo();

  return (
    <div className={className}>
      <TodoForm onSubmit={(data) => createTodo.mutate(data)} className="mb-4" />
      <ul className="divide-y divide-light-steel-blue overflow-hidden rounded-md shadow-lg dark:divide-dark-slate-blue">
        {todos.data?.map((todo) => (
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
    </div>
  );
};
