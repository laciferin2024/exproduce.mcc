import { ethers } from "hardhat"
import { parseUnits } from "ethers"
import {
  getWallet,
  getAddress,
  deployContract,
  getOptionsContract,
  getOptionsMarket,
  getERC20,
} from "../utils/web3.hre"
import { MockERC20, OptionsContract, OptionsMarket } from "../typechain-types"

async function main() {
  console.log("Starting Exproduce E2E Test...")

  // Get signers
  const deployer = await ethers.getSigner(
    "0x823531B7c7843D8c3821B19D70cbFb6173b9Cb02"
  )
  const farmer = getWallet("farmer")
  const bank = getWallet("bank")
  const trader = getWallet("trader")

  console.log("Accounts:")
  console.log("Deployer:", deployer.address)
  console.log("Farmer:", farmer.address)
  console.log("Bank:", bank.address)
  console.log("Trader:", trader.address)

  // Deploy MockUSDC (for testing)
  console.log("\nDeploying MockUSDC...")
  const mockUSDC = await deployContract<MockERC20>("MockERC20", deployer, [
    "Mock USDC",
    "USDC",
    6,
  ])
  await mockUSDC.waitForDeployment()
  console.log("MockUSDC deployed to:", await mockUSDC.getAddress())

  // Mint USDC to participants
  const usdcAmount = parseUnits("10000", 6) // 10,000 USDC
  await mockUSDC.mint(farmer.address, usdcAmount)
  await mockUSDC.mint(bank.address, usdcAmount)
  await mockUSDC.mint(trader.address, usdcAmount)
  console.log("Minted USDC to participants")

  // Deploy OptionsContract
  console.log("\nDeploying OptionsContract...")
  const optionsContract = await deployContract<OptionsContract>(
    "OptionsContract",
    deployer,
    [await mockUSDC.getAddress()]
  )
  await optionsContract.waitForDeployment()
  console.log(
    "OptionsContract deployed to:",
    await optionsContract.getAddress()
  )

  // Deploy OptionsMarket
  console.log("\nDeploying OptionsMarket...")
  const optionsMarket = await deployContract<OptionsMarket>(
    "OptionsMarket",
    deployer,
    [await mockUSDC.getAddress(), await optionsContract.getAddress()]
  )
  await optionsMarket.waitForDeployment()
  console.log("OptionsMarket deployed to:", await optionsMarket.getAddress())

  // Set OptionsMarket in OptionsContract
  await optionsContract.setOptionsMarket(await optionsMarket.getAddress())
  console.log("Set OptionsMarket in OptionsContract")

  // Approve USDC spending
  await mockUSDC
    .connect(farmer)
    .approve(await optionsContract.getAddress(), usdcAmount)
  await mockUSDC
    .connect(bank)
    .approve(await optionsContract.getAddress(), usdcAmount)
  await mockUSDC
    .connect(trader)
    .approve(await optionsMarket.getAddress(), usdcAmount)
  await mockUSDC
    .connect(bank)
    .approve(await optionsMarket.getAddress(), usdcAmount)
  console.log("Approved USDC spending")

  // Create an option
  const strikePrice = parseUnits("100", 6) // 100 USDC per unit
  const premium = parseUnits("10", 6) // 10 USDC premium
  const quantity = 10n // 10 units
  const expiryDate = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30) // 30 days from now

  console.log("\nCreating option...")
  const createTx = await optionsContract
    .connect(farmer)
    .createOption(
      bank.address,
      strikePrice,
      premium,
      expiryDate,
      quantity,
      "Corn"
    )
  const createReceipt = await createTx.wait()

  // Get the option ID from the event
  const optionCreatedEvent = createReceipt?.events?.find(
    (e) => e.event === "OptionCreated"
  )
  const optionId = optionCreatedEvent?.args?.[0] || 0n
  console.log("Option created with ID:", optionId.toString())

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

  // List the option on the market
  const listingPrice = parseUnits("15", 6) // 15 USDC (higher than premium)
  console.log("\nListing option on market...")
  const listTx = await optionsMarket
    .connect(farmer)
    .listOption(optionId, listingPrice)
  const listReceipt = await listTx.wait()

  // Get the listing ID from the event
  const optionListedEvent = listReceipt?.events?.find(
    (e) => e.event === "OptionListed"
  )
  const listingId = optionListedEvent?.args?.[0] || 0n
  console.log("Option listed with listing ID:", listingId.toString())

  // Trader buys the option
  console.log("\nTrader buying option...")
  await mockUSDC
    .connect(trader)
    .approve(await optionsMarket.getAddress(), listingPrice)
  const buyTx = await optionsMarket.connect(trader).buyOption(listingId)
  await buyTx.wait()
  console.log("Trader bought the option")

  // Verify ownership transfer
  const updatedOption = await optionsContract.getOption(optionId)
  console.log("New option owner:", updatedOption[0])
  console.log("Original owner:", farmer.address)
  console.log("Trader address:", trader.address)

  // Bank approves strike price payment for option exercise
  const totalStrikePrice = strikePrice * quantity
  await mockUSDC
    .connect(bank)
    .approve(await optionsContract.getAddress(), totalStrikePrice)
  console.log("Bank approved strike price payment")

  // Trader exercises the option
  console.log("\nTrader exercising option...")
  const exerciseTx = await optionsContract
    .connect(trader)
    .exerciseOption(optionId)
  await exerciseTx.wait()
  console.log("Option exercised successfully")

  // Check final option state
  const finalOption = await optionsContract.getOption(optionId)
  console.log("Final option state:")
  console.log(`- Farmer: ${finalOption[0]}`)
  console.log(`- Exercised: ${finalOption[7]}`)
  console.log(`- Cancelled: ${finalOption[8]}`)

  console.log("\nE2E Test completed successfully!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
