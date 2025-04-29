import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Exproduce Options Platform" },
    { name: "description", content: "Agricultural Options Trading Platform" },
  ];
};

export default function App() {
  return (
    <html lang="en" className="supports-[\n(container-type:inline-size)]:container-type-inline-size">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <Meta />
        <Links />
        <link rel="stylesheet" href="/styles/global.css" />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
