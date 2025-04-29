import { ethers } from "hardhat"
import { parseUnits } from "ethers"
import { OptionsContract, OptionsMarket, IERC20 } from "../typechain-types"
import { getWallet, getAddress } from "../utils/web3.hre"
import hre from "hardhat"

// Add the contract connection utilities
async function connectContract<T extends any>(name: string): Promise<T> {
  const deployment = await hre.deployments.get(name)
  const factory = await hre.ethers.getContractFactory(name)
  const contract = factory.attach(deployment.address) as unknown as T
  return contract
}

async function getContractAddress(name: string): Promise<string> {
  const deployment = await hre.deployments.get(name)
  return deployment.address
}

// Helper functions for our specific contracts
async function connectOptionsContract(): Promise<OptionsContract> {
  return connectContract<OptionsContract>("OptionsContract")
}

async function connectOptionsMarket(): Promise<OptionsMarket> {
  return connectContract<OptionsMarket>("OptionsMarket")
}

async function main() {
  // Get the network
  const network = await ethers.provider.getNetwork()
  console.log(`Connected to network: ${network.name} (${network.chainId})`)

  // Get signers
  const deployer = await ethers.getSigner(
    "0x823531B7c7843D8c3821B19D70cbFb6173b9Cb02"
  )
  const farmer = getWallet("farmer", hre.ethers.provider)
  const bank = getWallet("bank", hre.ethers.provider)

  console.log(`Using accounts:`)
  console.log(`- Deployer: ${deployer.address}`)
  console.log(`- Farmer: ${farmer.address}`)
  console.log(`- Bank: ${bank.address}`)

  // Connect to contracts using the new utility functions
  const optionsContract = await connectOptionsContract()
  const optionsMarket = await connectOptionsMarket()

  // For USDC, we still need to use getContractAt since it's not deployed by us

  const usdcAddress = await optionsContract.connect(deployer).paymentToken()

  const usdc = (await ethers.getContractAt("IERC20", usdcAddress)) as IERC20

  console.log("Contract addresses:")
  console.log(`- OptionsContract: ${await optionsContract.getAddress()}`)
  console.log(`- OptionsMarket: ${await optionsMarket.getAddress()}`)
  console.log(`- USDC: ${usdcAddress}`)

  // Check USDC balances
  const farmerBalance = await usdc.balanceOf(farmer.address)
  const bankBalance = await usdc.balanceOf(bank.address)
  console.log(`USDC Balances:`)
  console.log(`- Farmer: ${ethers.formatUnits(farmerBalance, 6)} USDC`)
  console.log(`- Bank: ${ethers.formatUnits(bankBalance, 6)} USDC`)

  // Create a new option
  console.log("\nCreating a new option...")

  // Approve USDC spending
  const premium = parseUnits("1", 6) // 10 USDC
  const approveTx = await usdc
    .connect(farmer)
    .approve(await optionsContract.getAddress(), premium)
  await approveTx.wait()
  console.log("Approved USDC spending for premium")

  // Create option
  const strikePrice = parseUnits("10", 6) // 100 USDC per unit
  const quantity = 5n // 5 units
  const expiryDate = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30) // 30 days from now

  const createTx = await optionsContract
    .connect(farmer)
    .createOption(
      bank.address,
      strikePrice,
      premium,
      expiryDate,
      quantity,
      "Wheat"
    )
  const createReceipt = await createTx.wait()

  // Get the option ID from the event
  const optionCreatedEvent = createReceipt?.events?.find(
    (e) => e.event === "OptionCreated"
  )
  const optionId = optionCreatedEvent?.args?.[0] || 0n
  console.log(`Option created with ID: ${optionId.toString()}`)

  // Get farmer's options
  const farmerOptions = await optionsContract.getFarmerOptions(farmer.address)
  console.log(`Farmer has ${farmerOptions.length} options`)

  // Get bank's options
  const bankOptions = await optionsContract.getBankOptions(bank.address)
  console.log(`Bank has ${bankOptions.length} options`)

  // Get option details
  const option = await optionsContract.getOption(optionId)
  console.log("Option details:")
  console.log(`- Farmer: ${option[0]}`)
  console.log(`- Bank: ${option[1]}`)
  console.log(`- Strike Price: ${ethers.formatUnits(option[2], 6)} USDC`)
  console.log(`- Premium: ${ethers.formatUnits(option[3], 6)} USDC`)
  console.log(
    `- Expiry Date: ${new Date(Number(option[4]) * 1000).toISOString()}`
  )
  console.log(`- Quantity: ${option[5].toString()}`)
  console.log(`- Crop Type: ${option[6]}`)
  console.log(`- Exercised: ${option[7]}`)
  console.log(`- Cancelled: ${option[8]}`)

  // List the option on the market
  console.log("\nListing option on the market...")
  const listingPrice = parseUnits("5", 6) // 5 USDC
  const listTx = await optionsMarket
    .connect(farmer)
    .listOption(optionId, listingPrice)
  const listReceipt = await listTx.wait()

  // Get the listing ID from the event
  const optionListedEvent = listReceipt?.events?.find(
    (e) => e.event === "OptionListed"
  )
  const listingId = optionListedEvent?.args?.[0] || 1n
  console.log(`Option listed with listing ID: ${listingId.toString()}`)

  // Get listing details
  const listing = await optionsMarket.getActiveListing(listingId)
  console.log("Listing details:")
  console.log(`- Option ID: ${listing[0]}`)
  console.log(`- Seller: ${listing[1]}`)
  console.log(`- Price: ${ethers.formatUnits(listing[2], 6)} USDC`)
  console.log(`- Active: ${listing[3]}`)

  console.table(listing)

  console.log("\nInteraction completed successfully!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
