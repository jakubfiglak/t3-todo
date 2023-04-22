import { api } from "~/utils/api";

export function useTodos() {
  return api.todos.getAll.useQuery();
}
