import { XMarkIcon } from "@heroicons/react/24/solid";
import type { Todo } from "@prisma/client";
import { twMerge } from "tailwind-merge";

import { Checkbox } from "~/components/Checkbox";

type TodoItemProps = {
  todo: Todo;
  onCheckboxChange: () => void;
  onHideButtonClick: () => void;
  className?: string;
};

export const TodoItem = ({
  todo,
  onCheckboxChange,
  onHideButtonClick,
  className,
}: TodoItemProps) => {
  return (
    <div
      className={twMerge(
        "flex items-center bg-white px-5 py-4 dark:bg-cherywood md:px-6 md:py-5",
        className
      )}
    >
      <Checkbox
        className="mr-3 md:mr-6"
        checked={todo.status === "COMPLETED"}
        onChange={onCheckboxChange}
      />
      <span
        className={twMerge(
          "text-lg",
          todo.status === "COMPLETED" &&
            "text-light-gray line-through dark:text-ming"
        )}
      >
        {todo.text}
      </span>
      <button className="ml-auto" onClick={onHideButtonClick}>
        <XMarkIcon className="h-5 w-5 dark:text-dark-slate-blue md:h-6 md:w-6" />
      </button>
    </div>
  );
};
