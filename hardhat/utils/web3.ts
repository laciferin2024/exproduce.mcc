import { ERC20 } from "typechain-types"

export async function connectContractAddress<T extends any>(
  hre,
  name,
  address: string
): Promise<T> {
  const factory = await hre.ethers.getContractFactory(name)
  const contract = factory.attach(address) as unknown as T
  return contract
}
