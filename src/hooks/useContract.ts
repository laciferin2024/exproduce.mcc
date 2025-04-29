import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import type { OptionsContract, OptionsMarket } from '../../hardhat/typechain-types';

export function useContract() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [optionsContract, setOptionsContract] = useState<OptionsContract | null>(null);
  const [optionsMarket, setOptionsMarket] = useState<OptionsMarket | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Initialize contracts here
        // You'll need to import your ABIs and addresses
      }
    };

    init();
  }, []);

  return { provider, optionsContract, optionsMarket };
}