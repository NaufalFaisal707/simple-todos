import { openDB, DBSchema } from "idb";

const db_name = "todo-db";
const db_collection = "todo";

export interface NoteDBSchema extends DBSchema {
  [db_name]: {
    key: string;
    value: string;
  };
  [db_collection]: {
    value: Todo;
    key: string;
    indexes: { todo_id: string };
  };
}

export type Todo = {
  todo_id?: string;
  title?: string;
  isChecked?: boolean;
  created_at?: string | number | Date;
  update_at?: string | number | Date;
};

async function idb() {
  return await openDB<NoteDBSchema>(db_name, 1, {
    upgrade(db) {
      const store = db.createObjectStore(db_collection, { keyPath: "todo_id" });
      store.createIndex("todo_id", "todo_id");
    },
  });
}

export async function addTodo(value: Todo) {
  const todo_id = new Date().getTime() + "";
  const created_at = new Date();
  const update_at = new Date();

  return (await idb()).add(db_collection, {
    ...value,
    todo_id,
    created_at,
    update_at,
  });
}

export async function getTodos() {
  return (await idb()).getAll(db_collection);
}

export async function getTodoById(todo_id: string) {
  return (await idb()).get(db_collection, todo_id);
}

export async function updateTodoById(
  todo_id: string,
  { title, isChecked }: { title?: string; isChecked: boolean },
) {
  const update_at = new Date();

  const targetTodo = await getTodoById(todo_id);

  if (targetTodo) {
    return (await idb()).put(db_collection, {
      ...{
        ...targetTodo,
        ...(title ? { title } : {}),
        isChecked,
      },
      update_at,
    });
  }

  throw "error updating todo id";
}

export async function deleteTodoById(todo_id: string) {
  return (await idb()).delete(db_collection, todo_id);
}
