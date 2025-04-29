import { ethers } from 'ethers';
import type { OptionsContract, OptionsMarket, IERC20 } from '../../hardhat/typechain-types';
import type { CreateOptionParams } from '~/types/contracts';

export class ContractManager {
  private provider: ethers.providers.Web3Provider;
  private optionsContract?: OptionsContract;
  private optionsMarket?: OptionsMarket;
  private usdc?: IERC20;

  constructor() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  async connect(): Promise<void> {
    await this.provider.send('eth_requestAccounts', []);
  }

  async createOption(params: CreateOptionParams): Promise<bigint> {
    if (!this.optionsContract) throw new Error('Contract not initialized');
    
    const tx = await this.optionsContract.createOption(
      params.bank,
      params.strikePrice,
      params.premium,
      params.expiryDate,
      params.quantity,
      params.cropType
    );
    
    const receipt = await tx.wait();
    const event = receipt.events?.find(e => e.event === 'OptionCreated');
    return event?.args?.[0] || 0n;
  }

  async getOption(optionId: bigint) {
    if (!this.optionsContract) throw new Error('Contract not initialized');
    return await this.optionsContract.getOption(optionId);
  }
}
