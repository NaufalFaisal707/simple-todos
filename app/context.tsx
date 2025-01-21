import type { ReactNode } from "react";
import { createContext, useState } from "react";
import { Todo } from "./db";

type TodoProviderProps = {
  defaultTodo?: Todo[];
  children: ReactNode;
};

export type todoState = {
  todo: Todo[];
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoContext = createContext<todoState | undefined>(undefined);

export function TodoProvider({ defaultTodo, children }: TodoProviderProps) {
  const [todo, setTodo] = useState<Todo[]>(defaultTodo || []);

  return (
    <TodoContext.Provider value={{ todo, setTodo }}>
      {children}
    </TodoContext.Provider>
  );
}
