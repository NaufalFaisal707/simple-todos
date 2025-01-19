import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import tailwind from "./tailwind.css?url";
import { HeartCrack, ClipboardX } from "lucide-react";
import Container2xl from "./components/container-2xl";

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

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
