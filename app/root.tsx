import type { MetaFunction, LinksFunction } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { WagmiConfig } from "wagmi"
import {
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit"
import { config } from "~/utils/wagmi.client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const meta: MetaFunction = () => {
  return [
    { title: "Exproduce Options Platform" },
    { name: "description", content: "Agricultural Options Trading Platform" },
  ]
}

import styles from "./tailwind.css?url"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="flex justify-end p-4 border-b">
              <ConnectButton />
            </header>
            <Outlet />
          </div>
        </Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}
