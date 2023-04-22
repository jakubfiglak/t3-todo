import type { Todo } from "@prisma/client";
import { twMerge } from "tailwind-merge";

type TodoItemProps = {
  todo: Todo;
  className?: string;
};

export const TodoItem = ({ todo, className }: TodoItemProps) => {
  return (
    <li key={todo.id} className={twMerge("px-5 py-4", className)}>
      {todo.text}
    </li>
  );
};
