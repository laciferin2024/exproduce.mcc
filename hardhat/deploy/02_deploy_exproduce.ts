import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { Contract } from "ethers"

/**
 * Deploys the Exproduce contracts
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployExproduce: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts()
  const { deploy } = hre.deployments

  console.log("Deployer:", deployer)

  let usdcAddress = (hre.network.config as any).usdc

  if (!usdcAddress || usdcAddress.trim() == "") {
    // First, deploy a mock payment token (for testing purposes)
    // In production, you would use an existing stablecoin like USDC
    const mockToken = await deploy("MockUSDC", {
      from: deployer,
      contract: "MockERC20",
      args: ["Mock USDC", "USDC", 6], // name, symbol, decimals
      log: true,
      autoMine: true,
    })
    console.log("Mock USDC deployed at:", mockToken.address)
    usdcAddress = mockToken.address
  }

  console.log("Using USDC at address:", usdcAddress)

  // Deploy the OptionsContract
  const optionsContract = await deploy("OptionsContract", {
    from: deployer,
    args: [usdcAddress],
    log: true,
    autoMine: true,
  })

  console.log("OptionsContract deployed at:", optionsContract.address)

  // Deploy the OptionsMarket
  const optionsMarket = await deploy("OptionsMarket", {
    from: deployer,
    args: [usdcAddress, optionsContract.address],
    log: true,
    autoMine: true,
  })

  console.log("OptionsMarket deployed at:", optionsMarket.address)

  // Set the OptionsMarket address in the OptionsContract
  const optionsContractInstance = await hre.ethers.getContract<Contract>(
    "OptionsContract",
    deployer
  )
  await optionsContractInstance.setOptionsMarket(optionsMarket.address)
  console.log("Set OptionsMarket address in OptionsContract")

  console.log("Deployment completed successfully!")
}

deployExproduce.id = "deployExproduce"

export default deployExproduce

module.exports.tags = ["all", "exproduce"]
