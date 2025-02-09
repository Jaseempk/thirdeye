import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getTokenInfo } from "../lib/web3";
import { apiRequest } from "../lib/queryClient";
import { TokenAnalyticsData } from "../types";

export const useTokenAnalytics = () => {
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useAccount();

  const { mutateAsync, isPending: isLoading } = useMutation({
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
        const { tokenName, tokenSymbol } = await getTokenInfo(address);

        const response = await apiRequest("POST", "/api/analyses", {
          contractAddress: address,
          tokenName: tokenName,
          tokenSymbol: tokenSymbol,
        });

        const data = await response.json();
        console.log("daataa:", data);
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to analyze token";
        setError(message);
        throw err;
      }
    },
  });

  const analyzeToken = useCallback(
    async (address: string) => {
      setError(null);
      try {
        return await mutateAsync(address);
      } catch (err) {
        console.log("error:", err);
        return null;
      }
    },
    [mutateAsync]
  );

  return {
    isLoading,
    error,
    analyzeToken,
  };
};
