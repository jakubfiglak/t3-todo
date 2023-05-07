import { type Todo } from "@prisma/client";

import { type GetAllTodosInput } from "~/modules/todos/schemas";
import { type api } from "~/utils/api";
import { generateRandomId } from "~/utils/helpers";

type Context = ReturnType<typeof api.useContext>;

export function buildTodo(text: string): Todo {
  return {
    id: generateRandomId(),
    text,
    authorId: generateRandomId(),
    status: "ACTIVE",
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const inputOptions: GetAllTodosInput[] = [
  {},
  { status: "ACTIVE" },
  { status: "COMPLETED" },
];

export function cancelOutgoingRefetches(ctx: Context) {
  return Promise.all(
    inputOptions.map((input) => ctx.todos.getAll.cancel(input))
  );
}

export function getPreviousCacheValues(ctx: Context) {
  const [allPreviousTodos, activePreviousTodos, completedPreviousTodos] =
    inputOptions.map((input) => ctx.todos.getAll.getData(input));

  return { allPreviousTodos, activePreviousTodos, completedPreviousTodos };
}

export function rollBack(
  ctx: Context,
  previousData: { all?: Todo[]; active?: Todo[]; completed?: Todo[] }
) {
  ctx.todos.getAll.setData({}, previousData.all);
  ctx.todos.getAll.setData({ status: "ACTIVE" }, previousData.active);
  ctx.todos.getAll.setData({ status: "COMPLETED" }, previousData.completed);
}

export function refetch(ctx: Context) {
  return inputOptions.map((input) => ctx.todos.getAll.invalidate(input));
}
