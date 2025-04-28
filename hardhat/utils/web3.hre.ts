import bluebird from "bluebird"
import hre, { ethers } from "hardhat"

import { AddressLike, BaseContract, BigNumberish, Signer } from "ethers"
import { ERC20, OptionsContract, OptionsMarket } from "../typechain-types"

/*

  CONSTANTS

*/

// how much ether to send to each account
export const DEFAULT_ETHER_PER_ACCOUNT = ethers.parseEther("1000")

// a billion tokens in total
export const DEFAULT_TOKEN_SUPPLY = ethers.parseEther("1000000000")

// each service gets 100000 tokens
export const DEFAULT_TOKENS_PER_ACCOUNT = ethers.parseEther("100000")

/*

  TYPES

*/
export interface Account {
  name: string
  address: string
  privateKey: string
}

// Hardcoded accounts for testing
const ACCOUNTS: Record<string, Account> = {
  deployer: {
    name: "deployer",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Default hardhat account
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  farmer: {
    name: "farmer",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Second hardhat account
    privateKey:
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  },
  bank: {
    name: "bank",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Third hardhat account
    privateKey:
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  },
  trader: {
    name: "trader",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Fourth hardhat account
    privateKey:
      "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  },
}

/*

  WALLET UTILS

*/
export const getAccount = (name: string): Account => {
  const account = ACCOUNTS[name]
  if (!account) {
    throw new Error(`Account ${name} not found`)
  }
  return account
}

export const getWallet = (name: string) => {
  const account = getAccount(name)
  return new ethers.Wallet(account.privateKey, ethers.provider)
}

export const getAddress = (name: string) => {
  const account = getAccount(name)
  return account.address
}

export const getRandomWallet = () => {
  return ethers.Wallet.createRandom()
}

export const transferEther = async (
  fromAccount: Account,
  toAccount: Account,
  amount: BigNumberish
) => {
  const signer = new hre.ethers.Wallet(
    fromAccount.privateKey,
    hre.ethers.provider
  )
  const tx = await signer.sendTransaction({
    to: toAccount.address,
    value: amount,
  })
  await tx.wait()
  console.log(
    `Moved ${amount} ETHER from ${fromAccount.name} (${fromAccount.address}) to ${toAccount.name} (${toAccount.address}) - ${tx.hash}.`
  )
}

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
