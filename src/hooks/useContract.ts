import { useAccount, useDisconnect, useWalletClient } from "wagmi"

import { getContract } from "viem"

import { abi as OptionsContractAbi } from "../../hardhat/deployments/amoy/OptionsContract.json"
import { abi as OptionsMarketAbi } from "../../hardhat/deployments/amoy/OptionsMarket.json"
import { abi as ERC20Abi } from "../../hardhat/artifacts/contracts/MockERC20.sol/MockERC20.json"
import { OptionsContract, OptionsMarket } from "hardhat/typechain-types"

export function useContract() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient() // This is the connected wallet's provider

  // Contract addresses (put these in config/env if preferred)
  const OPTIONS_CONTRACT_ADDRESS = "0x4A0f44a69092f12BdDfB31FF66E570d13Dac8475"
  const OPTIONS_MARKET_ADDRESS = "0x093EEa23421fc017754b1b54D764165F59B21B91"
  const USDC_ADDRESS = "0xAF5152E03C9519983a5E7e8b44ca1A396457607e"

  // Instantiate contracts with types
  const optionsContract = walletClient
    ? getContract({
        address: OPTIONS_CONTRACT_ADDRESS,
        abi: OptionsContractAbi, // Your actual ABI import
        client: { wallet: walletClient },
      })
    : null

  const optionsMarket = walletClient
    ? getContract({
        address: OPTIONS_MARKET_ADDRESS,
        abi: OptionsMarketAbi, // Your actual ABI import
        client: { wallet: walletClient },
      })
    : null

  const usdcContract = walletClient
    ? getContract({
        address: USDC_ADDRESS,
        abi: ERC20Abi, // Your actual ABI import
        client: { wallet: walletClient },
      })
    : null

  return {
    walletClient, // This replaces the old provider/signer
    optionsContract,
    usdcContract,
    optionsMarket,
    address,
    disconnect,
  }
}
