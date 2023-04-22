import type { CreateTodoInput } from "~/server/api/routers/todos";

type TodoFormProps = {
  onSubmit: (data: CreateTodoInput) => void;
  className?: string;
};

export const TodoForm = ({ onSubmit, className }: TodoFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          text: (e.target as unknown as { text: { value: string } }).text.value,
        });
      }}
      className={className}
    >
      <input
        type="text"
        name="text"
        placeholder="Create a new todo..."
        className="w-full rounded-md px-5 py-3"
      />
    </form>
  );
};
