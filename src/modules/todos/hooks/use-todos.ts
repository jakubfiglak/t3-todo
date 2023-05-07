import { type TodoStatus } from "@prisma/client";

import { api } from "~/utils/api";

export function useTodos(status?: TodoStatus) {
  return api.todos.getAll.useQuery({ status });
}
