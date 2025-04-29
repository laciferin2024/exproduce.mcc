import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { polygonAmoy } from "wagmi/chains"

export const config = getDefaultConfig({
  appName: "ExProduce",
  projectId: "fd4b30c6bd5fa4efa42fec80a2231c25", // Replace with your WalletConnect Project ID
  chains: [polygonAmoy],
  ssr: true,
})
