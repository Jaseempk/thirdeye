import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";

import { getTokenInfo } from "../lib/web3";
import { apiRequest } from "../lib/queryClient";
import { TokenAnalysis } from "../types";

export const useTokenAnalytics = () => {
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: async (address: string): Promise<TokenAnalysis> => {
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

        return data;
      } catch (err) {
        setError("Failed to analyze token");
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
