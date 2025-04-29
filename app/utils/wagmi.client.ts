import { http, createConfig } from "@wagmi/core"
import { mainnet, polygonAmoy } from "@wagmi/core/chains"
import { createClient } from "viem"

export const config = createConfig({
  chains: [polygonAmoy, mainnet],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
    })
  },
})

export const wagmiClient = createClient({
  chain: polygonAmoy,
  transport: http(),
})
