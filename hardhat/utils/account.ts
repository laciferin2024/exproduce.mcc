import { ethers, Wallet } from "ethers"
import * as process from "process"
import { HardhatRuntimeEnvironment } from "hardhat/types"

export interface Account {
  name: string
  address: string
  privateKey: string
  metadata?: Record<string, any>
}

let useDefaultValue = true

export function setDefaultValue(flag: boolean) {
  useDefaultValue = flag
  console.log("set default value to ", flag)
}

export const loadEnv = (name: string, defaultValue: string) => {
  const pKey = process.env[name]
  if (pKey) {
    return pKey
  }
  console.error(
    `Environment variable ${name} not found, using default value ${defaultValue}`
  )
  console.log("hardhat value be careful!!")
  if (useDefaultValue) {
    return defaultValue
  }

  return ""
}

export const loadPrivateKey = (name: string, defaultValue: string) => {
  return loadEnv(`${name.toUpperCase()}_PRIVATE_KEY`, defaultValue).trim()
}

export const loadAddress = (name: string, privateKey: string) => {
  let address: string

  try {
    const wallet = new Wallet(privateKey)
    address = wallet.address
    console.log(name + ": " + address)
  } catch (error: any) {
    console.error(
      `Error deriving address from private key for ${name}: ${error.message}`
    )
    process.exit(1)
  }

  return address
}

// the default values here are the hardhat default insecure accounts
// this means that we get a reproducible dev environment between hardhat and geth
export const ACCOUNTS: Account[] = [
  {
    name: "deployer",
    privateKey: loadPrivateKey(
      "deployer",
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    ),
    metadata: {},
  },
  {
    name: "farmer",
    privateKey: loadPrivateKey(
      "farmer",
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    ),
    metadata: {},
  },
  {
    name: "bank",
    privateKey: loadPrivateKey(
      "bank",
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
    ),
    metadata: {},
  },
  {
    name: "trader",
    privateKey: loadPrivateKey(
      "trader",
      "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
    ),
    metadata: {},
  },
  {
    name: "",
    privateKey: loadEnv(
      "PRIVATE_KEY",
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    ),
    metadata: {},
  },
].map((account: Account) => {
  // Check if the address is not already present
  if (!account.address) {
    // Derive the address using the loadAddress function
    account.address = loadAddress(account.name, account.privateKey)
  }
  return account
})

// map of account name -> account
export const NAMED_ACCOUNTS = ACCOUNTS.reduce<Record<string, Account>>(
  (all, acc) => {
    all[acc.name] = acc
    return all
  },
  {}
)

// map of account name -> account address
export const ACCOUNT_ADDRESSES = ACCOUNTS.reduce<Record<string, string>>(
  (all, acc) => {
    all[acc.name] = acc.address
    return all
  },
  {}
)

// flat list of private keys in order
export const PRIVATE_KEYS = ACCOUNTS.map((acc) => acc.privateKey)

export const getAccount = (name: string) => {
  const account = NAMED_ACCOUNTS[name]
  if (!account) {
    throw new Error(`Unknown account ${name}`)
  }
  return account
}

export const getWallet = (name: string, provider?: ethers.Provider) => {
  const account = getAccount(name)
  return new ethers.Wallet(account.privateKey, provider)
}

export const getAddress = (name: string) => {
  const account = getAccount(name)
  return account.address
}

export async function getBalance(
  account: string,
  hre: HardhatRuntimeEnvironment
) {
  const balance = await hre.ethers.provider.getBalance(account)
  return balance
}

export function formatEther(balance: bigint) {
  return ethers.formatEther(balance)
}

export async function getBalanceInEther(
  account: string,
  hre: HardhatRuntimeEnvironment
) {
  return formatEther(await getBalance(account, hre))
}

export function getPublicAddress(
  privateKey: string,
  hre?: HardhatRuntimeEnvironment
): string {
  let Wallet = hre?.ethers?.Wallet ?? ethers.Wallet
  const wallet = new Wallet(privateKey)
  return wallet.address
}

export function deriveAddress(addressOrPrivateKey: string): string {
  let address: string

  if (ethers.isAddress(addressOrPrivateKey)) {
    address = addressOrPrivateKey
  } else {
    try {
      const wallet = new ethers.Wallet(addressOrPrivateKey)
      address = wallet.address
    } catch (error) {
      console.error(error)
      throw new Error(
        "Invalid input: not a valid Ethereum address or private key"
      )
    }
  }

  return address
}

export const getRandomWallet = () => {
  return ethers.Wallet.createRandom()
}

export const transferEther = async (
  fromAccount: Account,
  toAccount: Account,
  amount: bigint,
  provider: ethers.Provider
) => {
  const signer = new ethers.Wallet(fromAccount.privateKey, provider)
  const tx = await signer.sendTransaction({
    to: toAccount.address,
    value: amount,
  })
  await tx.wait()
  console.log(
    `Moved ${amount} ETHER from ${fromAccount.name} (${fromAccount.address}) to ${toAccount.name} (${toAccount.address}) - ${tx.hash}.`
  )
}
