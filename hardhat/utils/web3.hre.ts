import bluebird from "bluebird"
import hre, { ethers } from "hardhat"

import { AddressLike, BaseContract, Signer } from "ethers"
import { ERC20, OptionsContract, OptionsMarket } from "../typechain-types"
import { getAccount, getWallet, getAddress } from "./account"

/*

  CONSTANTS

*/

// how much ether to send to each account
export const DEFAULT_ETHER_PER_ACCOUNT = ethers.parseEther("1000")

// a billion tokens in total
export const DEFAULT_TOKEN_SUPPLY = ethers.parseEther("1000000000")

// each service gets 100000 tokens
export const DEFAULT_TOKENS_PER_ACCOUNT = ethers.parseEther("100000")

// Re-export account utilities
export { getAccount, getWallet, getAddress }

/*

  DEPLOYMENT

*/
export async function deployContract<T extends BaseContract>(
  name: string,
  signer: Signer,
  args: any[] = []
): Promise<T> {
  const factory = await ethers.getContractFactory(name, signer)
  const contract = (await factory.deploy(...args)) as unknown as T
  return contract
}

/*

  CONTRACT INTERACTION HELPERS

*/
export async function connectContract<T extends any>(name: string): Promise<T> {
  const deployment = await hre.deployments.get(name)
  const factory = await hre.ethers.getContractFactory(name)
  const contract = factory.attach(deployment.address) as unknown as T
  return contract
}

export async function getContractAddress(name: string): Promise<AddressLike> {
  const deployment = await hre.deployments.get(name)
  return deployment.address
}

export async function getOptionsContract(
  address: string,
  signer?: Signer
): Promise<OptionsContract> {
  return (await ethers.getContractAt(
    "OptionsContract",
    address,
    signer
  )) as unknown as OptionsContract
}

export async function getOptionsMarket(
  address: string,
  signer?: Signer
): Promise<OptionsMarket> {
  return (await ethers.getContractAt(
    "OptionsMarket",
    address,
    signer
  )) as unknown as OptionsMarket
}

export async function getERC20(
  address: string,
  signer?: Signer
): Promise<ERC20> {
  return (await ethers.getContractAt(
    "ERC20",
    address,
    signer
  )) as unknown as ERC20
}

// Helper functions for our specific contracts
export async function connectOptionsContract(): Promise<OptionsContract> {
  return connectContract<OptionsContract>("OptionsContract")
}

export async function connectOptionsMarket(): Promise<OptionsMarket> {
  return connectContract<OptionsMarket>("OptionsMarket")
}
