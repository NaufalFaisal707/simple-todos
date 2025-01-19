import type { MetaFunction } from "@remix-run/node";
import { Clipboard, ClipboardList, Plus, SearchX } from "lucide-react";
import { Suspense, useState } from "react";
import Container2xl from "~/components/container-2xl";
import CreateTodo from "~/components/create-todo";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { getTodos } from "~/db";
import { Await, useAsyncValue } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Todos" }];
};

export default function Index() {
  const [namaTodo, setNamaTodo] = useState("");

  const [createTodo, setCreateTodo] = useState(false);

  function AllTodos({ className }: { className?: string }) {
    const todos = useAsyncValue() as Awaited<ReturnType<typeof getTodos>>;

    if (todos.length === 0 && namaTodo) {
      return (
        <div
          className={cn(
            className,
            "grid h-full place-content-center gap-4 text-neutral-400",
          )}
        >
          <SearchX className="mx-auto size-12" />
          <p>Tidak ditemukan hasil dari pencarian</p>
        </div>
      );
    }

    if (todos.length === 0) {
      return (
        <div
          className={cn(
            className,
            "grid h-full place-content-center gap-4 text-neutral-400",
          )}
        >
          <Clipboard className="mx-auto size-12" />
          <p>Belum ada todo di sini</p>
        </div>
      );
    }
  }

  return (
    <Container2xl className="flex h-svh flex-col">
      {/* navbar */}
      <nav className="sticky top-0 flex select-none justify-between gap-4 bg-white bg-opacity-80 p-4 backdrop-blur">
        <div className="hidden items-center gap-2 sm:flex">
          <ClipboardList />
          <h1 className="text-lg">Todos</h1>
        </div>

        <div className="flex w-full gap-4 sm:w-fit">
          <Input
            type="search"
            title="Cari Todo"
            placeholder="Cari Todo"
            className="truncate duration-150 ease-in-out"
            onChange={({ target }) => setNamaTodo(target.value)}
          />

          <Button
            title="Buat Todo"
            variant="outline"
            onClick={() => setCreateTodo(!createTodo)}
          >
            <Plus />
          </Button>
        </div>

        <CreateTodo open={createTodo} onOpenChange={setCreateTodo} />
      </nav>

      {/* All Todos */}
      <Suspense>
        <Await resolve={getTodos()}>
          <AllTodos className="select-none" />
        </Await>
      </Suspense>
    </Container2xl>
  );
}
