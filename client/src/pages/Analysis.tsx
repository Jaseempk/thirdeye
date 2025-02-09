import React, { useState } from "react";
import { TokenAnalytics } from "../components/TokenAnalytics";
import { useTokenAnalytics } from "../hooks/useTokenAnalytics";
import { TokenAnalyticsData } from "../types";

interface AnalysisProps {
  address: string;
}

export const Analysis: React.FC<AnalysisProps> = ({
  address: initialAddress,
}) => {
  const [tokenData, setTokenData] = useState<TokenAnalyticsData | null>(null);
  const { analyzeToken, isLoading, error } = useTokenAnalytics();

  const handleAnalyze = async (address: string) => {
    try {
      const result = await analyzeToken(address);
      if (result) {
        setTokenData(result);
      }
    } catch (err) {
      console.log("error:", err);
      // Error is already handled by the hook
      setTokenData(null);
    }
  };

  // Analyze initial address if provided
  React.useEffect(() => {
    if (initialAddress) {
      handleAnalyze(initialAddress);
    }
  }, [initialAddress]);

  return (
    <div className="container mx-auto px-4 py-8">
      <TokenAnalytics
        address={initialAddress}
        tokenData={tokenData || undefined}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
