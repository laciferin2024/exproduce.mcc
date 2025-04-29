import { useState, useEffect } from "react"

import type {
  OptionsContract,
  OptionsMarket,
} from "../../hardhat/typechain-types"
import { useAccount, useDisconnect } from "wagmi"

export function useContract() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  return {
    provider: null,
    optionsContract: null,
    optionsMarket: null,
    address,
    disconnect,
  }
}
