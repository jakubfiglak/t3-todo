import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { type CreateTodoInput, createTodoInput } from "../schemas";

type TodoFormProps = {
  onSubmit: (data: CreateTodoInput) => void;
  className?: string;
};

export const TodoForm = ({ onSubmit, className }: TodoFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitting, errors },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoInput),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="relative before:absolute before:left-5 before:top-1/2 before:block before:h-5 before:w-5 before:-translate-y-1/2 before:rounded-full before:border before:border-light-steel-blue dark:before:border-dark-slate-blue before:md:left-6 before:md:h-6 before:md:w-6">
        <input
          {...register("text")}
          disabled={isSubmitting}
          type="text"
          placeholder="Create a new todo..."
          className={twMerge(
            "w-full rounded-md py-4 pl-14 pr-5 dark:bg-cherywood md:py-5 md:pl-16 md:pr-5 md:text-lg",
            errors.text && "border border-crimson"
          )}
        />
      </div>
      {errors.text && (
        <span className="my-1 inline-block rounded-sm bg-cherywood/60 px-1 text-sm text-crimson">
          {errors.text?.message}
        </span>
      )}
    </form>
  );
};
