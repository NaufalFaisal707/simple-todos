import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  Link,
  useLoaderData,
  ClientActionFunctionArgs,
  Form,
  useActionData,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import tailwind from "./tailwind.css?url";
import Container2xl from "./components/container-2xl";
import {
  HeartCrack,
  ClipboardX,
  Clipboard,
  ClipboardList,
  Plus,
  SearchX,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { getTodoById, getTodos, Todo, updateTodoById } from "~/db";
import { Checkbox } from "~/components/ui/checkbox";
import { TodoContext, TodoProvider, todoState } from "./context";

export const meta: MetaFunction = () => {
  return [{ title: "Todos" }];
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: tailwind,
  },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  if (request.method !== "PUT") {
    throw Response.json(null, {
      status: 405,
      statusText: "metode tidak di ijinkan!",
    });
  }

  const [[todo_id, state]] = Object.entries(
    Object.fromEntries(await request.formData()),
  ) as [[string, "on" | "off"]];

  await updateTodoById(todo_id, {
    isChecked: state === "on",
  });

  return await getTodoById(todo_id);
};

export const clientLoader = async () => await getTodos();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container2xl className="flex h-svh flex-col">
        <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
          <ClipboardX className="mx-auto size-12" />
          <p className="max-w-sm text-wrap text-center">{error.statusText}</p>
        </div>
      </Container2xl>
    );
  } else if (error instanceof Error) {
    return (
      <Container2xl className="flex h-svh flex-col">
        <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
          <HeartCrack className="mx-auto size-12" />
          <p className="max-w-sm text-wrap text-center">{error.message}</p>
        </div>
      </Container2xl>
    );
  } else {
    return (
      <Container2xl className="flex h-svh flex-col">
        <div className="grid h-full place-content-center gap-2 text-center text-neutral-400">
          <HeartCrack className="mx-auto size-12" />
          <p>Aplikasi Catatan Rusak</p>
        </div>
      </Container2xl>
    );
  }
};

const TodoIndexComponents = ({
  loaderData,
  actionData,
}: {
  loaderData: Awaited<ReturnType<typeof clientLoader>>;
  actionData: Awaited<ReturnType<typeof clientAction>>;
}) => {
  const [namaTodo, setNamaTodo] = useState("");

  const { todo, setTodo } = useContext(TodoContext) as todoState;

  useEffect(() => {
    setTodo(loaderData);
  }, [loaderData, setTodo]);

  useEffect(() => {
    setTodo((prev) => {
      const targetIndex = prev.findIndex(
        (fi) => fi.todo_id === actionData?.todo_id,
      );

      if (targetIndex !== -1) {
        const updatedTodos = [...prev];
        updatedTodos[targetIndex] = { ...prev[targetIndex], ...actionData };
        return updatedTodos;
      }

      return prev;
    });
  }, [actionData, setTodo]);

  function AllTodos({ className }: { className?: string }) {
    function filterTodo() {
      return todo.filter((f) => {
        return f.title?.toLowerCase().includes(namaTodo.toLowerCase());
      });
    }

    if (filterTodo().length === 0 && namaTodo) {
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

    if (filterTodo().length === 0) {
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

    return (
      <div
        className={cn(className, "grid grid-cols-1 gap-4 overflow-auto p-4")}
      >
        {filterTodo().map((m, key) => (
          <TodoCard key={key} todo={m} />
        ))}
      </div>
    );
  }

  const TodoCard = ({ todo }: { todo: Todo }) => {
    const { title, todo_id, isChecked } = todo;

    return (
      <Form method="PUT">
        <label
          htmlFor={todo_id}
          className={cn(
            isChecked
              ? "border-neutral-200 bg-neutral-50 text-neutral-400"
              : "",
            "flex cursor-pointer items-center gap-4 rounded-md border p-4",
          )}
        >
          <input
            defaultValue={!isChecked ? "on" : "off"}
            name={todo_id}
            hidden
          />
          <Checkbox
            type="submit"
            defaultChecked={isChecked}
            id={todo_id}
            className="size-6"
          />
          <span className="grow text-lg">{title || "- tanpa judul -"}</span>
          <Button
            variant={isChecked ? "outline" : "destructive"}
            size="icon"
            asChild
          >
            <Link to={"/" + todo_id + "/delete"}>
              <Trash2 />
            </Link>
          </Button>
        </label>
      </Form>
    );
  };

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

          <Button title="Buat Todo" variant="outline" asChild>
            <Link to="/new" replace>
              <Plus />
            </Link>
          </Button>
        </div>
      </nav>

      {/* All Todos */}
      <AllTodos className="select-none" />
    </Container2xl>
  );
};

export default function App() {
  const actionData = useActionData<typeof clientAction>();
  const loaderData = useLoaderData<typeof clientLoader>();

  return (
    <TodoProvider>
      {/* Popup Components */}
      <Outlet />

      {/* Notes Components */}
      <TodoIndexComponents actionData={actionData} loaderData={loaderData} />
    </TodoProvider>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
