import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { CreateTodoInput } from "~/server/api/routers/todos";

type TodoFormProps = {
  onSubmit: (data: CreateTodoInput) => void;
  className?: string;
};

export const TodoForm = ({ onSubmit, className }: TodoFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<CreateTodoInput>();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <input
        {...register("text")}
        type="text"
        placeholder="Create a new todo..."
        className="w-full rounded-md px-5 py-3"
      />
    </form>
  );
};
