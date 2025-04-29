import * as dotenv from "dotenv"
import * as process from "process"

const ENV_FILE = process.env.CONFIG || "./.env"
console.log(`ENV_FILE is ${ENV_FILE}`)
dotenv.config({ path: ENV_FILE })

import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "@nomicfoundation/hardhat-verify"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import { HardhatUserConfig, NetworkUserConfig } from "hardhat/types"

import { ACCOUNT_ADDRESSES, PRIVATE_KEYS } from "./utils/account"

// If not set, it uses ours Alchemy's default API key.
const providerApiKey =
  process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF"
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey =
  process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW"
const INFURA_KEY = process.env.INFURA_KEY || ""

let NETWORK = process.env.NETWORK || "amoy"
console.log(`Using network: ${NETWORK}`)
console.log(`Infura key is ${INFURA_KEY}`)

// Define custom network type with additional properties
type _Network = NetworkUserConfig & {
  ws?: string
  faucet?: string | Array<string>
  explorer?: string
  confirmations?: number
  usdc?: string
}

// Extend HardhatUserConfig to include our custom network type
interface _Config extends HardhatUserConfig {
  networks: {
    [network: string]: _Network
  }
}

const config: _Config = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: NETWORK,
  namedAccounts: ACCOUNT_ADDRESSES,
  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
      chainId: 1337,
      accounts: [
        {
          privateKey:
            process.env.PRIVATE_KEY ||
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          balance: `${1000000000000000000000000n}`,
        },
        ...PRIVATE_KEYS.map((privateKey) => {
          return {
            privateKey: privateKey,
            balance: `${1000000000000000000000000n}`,
          }
        }),
      ],
      usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", // Mock USDC for local testing
      saveDeployments: true,
    },
    localhost: {
      url: "http://localhost:8545",
      ws: "ws://localhost:8546",
      chainId: 1337,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
      usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", // Mock USDC for local testing
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      ws: `wss://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      chainId: 11155111,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
    },
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`,
      ws: "wss://polygon-amoy-bor-rpc.publicnode.com",
      chainId: 80002,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
      // usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", // Amoy USDC
      usdc: "0xAF5152E03C9519983a5E7e8b44ca1A396457607e", // Darts
      faucet: ["https://faucet.polygon.technology"],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      ws: "wss://base-sepolia-rpc.publicnode.com",
      chainId: 84532,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
      faucet: ["https://www.coinbase.com/faucets/base-sepolia-faucet"],
    },
  },
  // configuration for hardhat-verify plugin
  etherscan: {
    apiKey: `${etherscanApiKey}`,
    customChains: [
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
    dontOverrideCompile: false,
  },
}

export default config
