import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { getTokenInfo } from '../lib/web3';
import { apiRequest } from '../lib/queryClient';
import { TokenAnalyticsData } from '../types';

export const useTokenAnalytics = () => {
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useAccount();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (address: string): Promise<TokenAnalyticsData> => {
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }
      
      if (!window.ethereum) {
        throw new Error("MetaMask not connected");
      }
      
      if (!ethers.isAddress(address)) {
        throw new Error("Invalid address");
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const { name, symbol } = await getTokenInfo(address, provider);

        const response = await apiRequest("POST", "/api/analyses", {
          contractAddress: address,
          tokenName: name,
          tokenSymbol: symbol,
        });

        const data = await response.json();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to analyze token';
        setError(message);
        throw err;
      }
    }
  });

  const analyzeToken = useCallback(
    (address: string) => {
      setError(null);
      return mutate(address);
    },
    [mutate]
  );

  return {
    isLoading,
    error,
    analyzeToken
  };
};