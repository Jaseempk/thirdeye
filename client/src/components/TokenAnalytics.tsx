import React from "react";
import {
  Twitter,
  ExternalLink,
  Search,
  AlertTriangle,
  // Clock,
  Users,
  // DollarSign,
  Copy,
  Loader2,
  Info,
  TrendingUp,
} from "lucide-react";
import { PieChart } from "react-minimal-pie-chart";
import { TokenAnalyticsData } from "../types";
import {
  formatAddress,
  formatNumber,
  formatPercentage,
  formatHolderPercentage,
} from "../utils/formatters";

import { getEthPrice } from "@/utils/price";

interface TokenAnalyticsProps {
  address: string;
  tokenData?: TokenAnalyticsData;
  onAnalyze: (address: string) => void;
  isLoading: boolean;
  error: string | null;
}
// Add type definitions for the pie chart data
interface HolderDistributionItem {
  title: string;
  value: number;
  color: string;
  isContract: boolean;
  isSingleHolder?: boolean;
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({
  address,
  tokenData,
  onAnalyze,
  isLoading,
  error,
}) => {
  const [searchAddress, setSearchAddress] = React.useState(address);
  const [hoveredSegment, setHoveredSegment] = React.useState<number | null>(
    null
  );
  const somNumber = 70;

  const [ethPrice, setEthPrice] = React.useState<number>(0);
  const [builderScore, setBuilderScore] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchEthPrice = async () => {
      const price = await getEthPrice();

      setEthPrice(price);
    };

    fetchEthPrice();
  }, []);

  const mcInEth = formatNumber(
    Number(tokenData?.analysis?.deployer?.tokenInfo?.marketCap)
  );
  const mcInUsd = Number(mcInEth) * ethPrice;
  if (tokenData?.analysis?.deployer?.address) {
    const fetchBuilderScore = async () => {
      console.log("deployer:", tokenData?.analysis?.deployer?.address);
      const response = await fetch(
        `https://api.talentprotocol.com/api/v2/passports/${tokenData?.analysis?.deployer?.address}`,
        {
          method: "GET",
          headers: {
            "x-api-key":
              "aa96ca991e7766834efe5e4caee803866a1c67dad2d11016b11d56f77a1a",
          },
        }
      );
      const data = await response.json();

      const _builderScore = data.passport.score;
      setBuilderScore(_builderScore);
    };

    fetchBuilderScore();
  }

  // Process top holders data for pie chart
  const processHoldersData = (): HolderDistributionItem[] => {
    if (!tokenData?.analysis?.topHolders) return [];

    const holders = tokenData.analysis.topHolders;

    // If no holders, return empty array
    if (holders.length === 0) {
      return [
        {
          title: "No holders data",
          value: 100,
          color: "#4B5563",
          isContract: false,
        },
      ];
    }

    // If single holder owns everything
    if (holders.length === 1 && holders[0].percentage >= 99) {
      return [
        {
          title: formatAddress(holders[0].address),
          value: holders[0].percentage,
          color: "#EB88EF",
          isContract: holders[0].isContract,
          isSingleHolder: true,
        },
      ];
    }

    // Take top 20 holders or all holders if less than 20
    const topHolders = holders.slice(0, Math.min(20, holders.length));

    // Calculate total percentage for "Others"
    const topHoldersTotal = topHolders.reduce(
      (sum, holder) => sum + holder.percentage,
      0
    );
    const othersPercentage = Math.max(0, 100 - topHoldersTotal);

    // Create pie chart data with colors
    const colors = [
      "#EB88EF",
      "#E7692C",
      "#4BA5F2",
      "#EFBC41",
      "#6366F1",
      "#EC4899",
      "#8B5CF6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#14B8A6",
      "#F97316",
      "#6366F1",
      "#8B5CF6",
      "#EC4899",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#E7692C",
    ];

    const pieData = topHolders.map((holder, index) => ({
      title: formatAddress(holder.address),
      value: holder.percentage,
      color: colors[index % colors.length],
      isContract: holder.isContract,
    }));

    // Add "Others" segment if there are more holders
    if (othersPercentage > 0.1) {
      // Only add if more than 0.1%
      pieData.push({
        title: "Others",
        value: othersPercentage,
        color: "#4B5563",
        isContract: false,
      });
    }

    return pieData;
  };

  const distributionData = processHoldersData();

  // Add function to handle address copy
  const handleAddressCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    // You could optionally add a toast notification here
  };

  if (!tokenData) {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-6">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Search Input and Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter token address..."
                className="flex-1 bg-black/20 border border-primary/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white font-suisse text-sm md:text-base placeholder:text-gray-500"
              />
              <button
                onClick={() => onAnalyze(searchAddress)}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#E7692C] to-[#EB88EF] px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-nohemi flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity min-w-[120px] md:min-w-[140px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                )}
                <span className="text-sm md:text-base">
                  {isLoading ? "Analyzing..." : "Analyze"}
                </span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 md:p-4">
                <div className="text-red-400 font-suisse text-sm md:text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 md:py-12">
                <div className="relative">
                  <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-primary animate-spin" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl" />
                </div>
                <div className="mt-6 md:mt-8 text-center">
                  <p className="text-gray-300 font-nohemi text-base md:text-lg mb-2">
                    Analyzing token data...
                  </p>
                  <p className="text-gray-500 font-suisse text-sm md:text-base">
                    This might take a few moments
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="bg-black/20 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              {/* Token Image */}
              {tokenData?.imageUrl ? (
                <img
                  src={tokenData.imageUrl}
                  alt={tokenData.tokenName}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-primary/20 animate-float"
                />
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-primary/20">
                  <span className="font-carbonic text-xl md:text-2xl text-primary/60">
                    {tokenData?.tokenSymbol?.[0] || "?"}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                {" "}
                {/* Ensures text truncation works */}
                <h2 className="font-carbonic text-2xl md:text-3xl truncate">
                  {tokenData?.tokenName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 font-suisse text-sm md:text-base">
                    ${tokenData?.tokenSymbol}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(tokenData?.contractAddress)
                    }
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Score */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
            <div className="text-2xl sm:text-3xl md:text-4xl font-carbonic bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              {formatPercentage(tokenData.score)}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-suisse">
              Safety Score
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <h3 className="font-carbonic text-xl mb-4">AI Analysis</h3>
        <div className="space-y-4">
          {tokenData.analysis?.aiAnalysis?.insights?.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-black/30 p-4 rounded-lg border border-primary/10"
            >
              {insight.toLowerCase().includes("warning") ||
              insight.toLowerCase().includes("risk") ? (
                <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 text-green-400 mt-1 flex-shrink-0">
                  ✓
                </div>
              )}
              <p className="font-suisse text-sm text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Info */}
        <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
          <h3 className="font-carbonic text-xl mb-4 flex items-center gap-2 text-cyan-300">
            <Info className="w-5 h-5" />
            Token Info
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Contract:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {formatAddress(tokenData?.contractAddress)}
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(tokenData?.contractAddress)
                  }
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Holders:</span>
              <span>{tokenData.analysis?.holderCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">MarketCap:</span>
              <span>${mcInUsd}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Volum24h:</span>
              <span>
                {formatNumber(
                  Number(tokenData.analysis?.deployer?.tokenInfo?.volume24h)
                )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Liquidity Score:</span>
              <div className="flex items-center gap-2">
                <span
                  className={
                    tokenData.analysis?.liquidityScore < 50
                      ? "text-red-400"
                      : "text-green-400"
                  }
                >
                  {tokenData.analysis?.liquidityScore}/100
                </span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Contract Verified:</span>
              <span
                className={
                  tokenData.analysis?.contractVerified
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {tokenData.analysis?.contractVerified ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Launched on Flaunch:</span>
              <span
                className={
                  tokenData.analysis?.launchedOnFlaunch
                    ? "text-green-400"
                    : "text-gray-400"
                }
              >
                {tokenData.analysis?.launchedOnFlaunch ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ownership Concentration:</span>
              <span
                className={
                  tokenData?.analysis?.ownershipRatio > 50
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {tokenData?.analysis?.ownershipRatio}%
              </span>
            </div>
          </div>
        </div>

        {/* Deployer Info */}
        <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
          <h3 className="font-carbonic text-xl mb-4 flex items-center gap-2 text-cyan-300">
            <Users className="w-5 h-5" />
            Deployer Info
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Address:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {formatAddress(tokenData?.analysis?.deployer?.address)}
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      tokenData?.analysis?.deployer?.address
                    )
                  }
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Collections:</span>
              <span>
                {tokenData?.analysis?.deployer?.flaunchStats?.totalCollections}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Successful Launches:</span>
              <span>
                {
                  tokenData?.analysis?.deployer?.flaunchStats
                    ?.successfulLaunches
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Success Rate:</span>
              <span
                className={
                  // tokenData.deployerInfo.successRate >= 70
                  somNumber ? "text-green-400" : "text-warning"
                }
              >
                {60}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">First Launch:</span>
              <span>
                {
                  tokenData?.analysis?.deployer?.flaunchStats?.firstLaunchDate?.split(
                    "T"
                  )[0]
                }
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Dev builder-score:</span>
              <span>{builderScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holder Statistics */}
      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <h3 className="font-carbonic text-xl mb-6 text-cyan-300">
          Holder Statistics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution */}
          <div>
            <h4 className="font-carbonic text-lg mb-4">Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top 10 Holders:</span>
                <span
                  className={
                    tokenData?.analysis?.holderStatistics?.holderSupply?.top10
                      .supplyPercent > 50
                      ? "text-warning"
                      : "text-green-400"
                  }
                >
                  {
                    tokenData?.analysis?.holderStatistics?.holderSupply?.top10
                      .supplyPercent
                  }
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top 25 Holders:</span>
                <span>
                  {
                    tokenData?.analysis?.holderStatistics?.holderSupply?.top25
                      .supplyPercent
                  }
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top 50 Holders:</span>
                <span>
                  {
                    tokenData?.analysis?.holderStatistics?.holderSupply?.top50
                      .supplyPercent
                  }
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top 100 Holders:</span>
                <span>
                  {
                    tokenData?.analysis?.holderStatistics?.holderSupply?.top100
                      .supplyPercent
                  }
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Holder Changes */}
          <div>
            <h4 className="font-carbonic text-lg mb-4">Holder Changes</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last 5min:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "5min"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {tokenData?.analysis?.holderStatistics?.holderChange?.[
                      "5min"
                    ].change > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "5min"
                      ].change
                    }
                  </span>
                  <span className="text-gray-400">
                    (
                    {tokenData?.analysis?.holderStatistics?.holderChange?.[
                      "5min"
                    ]?.changePercent > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "5min"
                      ]?.changePercent
                    }
                    %)
                  </span>
                  <TrendingUp
                    className={`w-4 h-4 ${
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "5min"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last 1h:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "1h"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {tokenData?.analysis?.holderStatistics?.holderChange?.["1h"]
                      .change > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "1h"
                      ].change
                    }
                  </span>
                  <span className="text-gray-400">
                    (
                    {tokenData?.analysis?.holderStatistics?.holderChange?.["1h"]
                      ?.changePercent > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "1h"
                      ]?.changePercent
                    }
                    %)
                  </span>
                  <TrendingUp
                    className={`w-4 h-4 ${
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "1h"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last 6h:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "6h"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {tokenData?.analysis?.holderStatistics?.holderChange?.["1h"]
                      .change > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "6h"
                      ].change
                    }
                  </span>
                  <span className="text-gray-400">
                    (
                    {tokenData?.analysis?.holderStatistics?.holderChange?.["6h"]
                      ?.changePercent > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "6h"
                      ]?.changePercent
                    }
                    %)
                  </span>
                  <TrendingUp
                    className={`w-4 h-4 ${
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "6h"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last 24h:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "24h"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {tokenData?.analysis?.holderStatistics?.holderChange?.[
                      "24h"
                    ].change > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "24h"
                      ].change
                    }
                  </span>
                  <span className="text-gray-400">
                    (
                    {tokenData?.analysis?.holderStatistics?.holderChange?.[
                      "24h"
                    ]?.changePercent > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "24h"
                      ]?.changePercent
                    }
                    %)
                  </span>
                  <TrendingUp
                    className={`w-4 h-4 ${
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "24h"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last 30d:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "30d"
                      ]?.changePercent >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {tokenData?.analysis?.holderStatistics?.holderChange?.[
                      "30d"
                    ].change > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "30d"
                      ].change
                    }
                  </span>
                  <span className="text-gray-400">
                    (
                    {tokenData?.analysis?.holderStatistics?.holderChange?.[
                      "30d"
                    ]?.changePercent > 0
                      ? "+"
                      : ""}
                    {
                      tokenData?.analysis?.holderStatistics?.holderChange?.[
                        "30d"
                      ]?.changePercent
                    }
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holder Distribution Chart */}
      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <h3 className="font-carbonic text-xl mb-6 flex items-center gap-2 text-cyan-300">
          <Users className="w-5 h-5" />
          Holder Distribution
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="font-carbonic text-2xl">
                  {hoveredSegment !== null
                    ? formatPercentage(distributionData[hoveredSegment].value)
                    : "100%"}
                </div>
                <div className="text-sm text-gray-400 font-suisse">
                  {hoveredSegment !== null
                    ? distributionData[hoveredSegment].title
                    : distributionData.length === 1 &&
                      "isSingleHolder" in distributionData[0] &&
                      distributionData[0].isSingleHolder
                    ? "Single Holder"
                    : "Total"}
                </div>
              </div>
            </div>
            <PieChart
              data={distributionData}
              lineWidth={30}
              paddingAngle={0.5}
              animate
              animationDuration={500}
              onMouseOver={(_, index) => setHoveredSegment(index)}
              onMouseOut={() => setHoveredSegment(null)}
              segmentsStyle={{
                transition: "stroke-width 0.2s",
                cursor: "pointer",
              }}
              segmentsShift={(index) => (hoveredSegment === index ? 2 : 0)}
              style={{ height: "300px" }}
              startAngle={-90}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {distributionData.length === 1 &&
            "isSingleHolder" in distributionData[0] &&
            distributionData[0].isSingleHolder ? (
              <div className="col-span-2 p-4 bg-red-500/20 rounded-lg border border-red-500/40">
                <p className="text-red-400 font-suisse text-sm">
                  Warning: Single holder owns{" "}
                  {formatPercentage(distributionData[0].value)} of the total
                  supply
                </p>
              </div>
            ) : distributionData.length === 1 &&
              distributionData[0].title === "No holders data" ? (
              <div className="col-span-2 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/40">
                <p className="text-yellow-400 font-suisse text-sm">
                  No holder data available for this token
                </p>
              </div>
            ) : (
              distributionData.map((item, index) => {
                // Find the original holder data to get the full address
                const originalHolder = tokenData?.analysis?.topHolders?.[index];
                const fullAddress = originalHolder?.address || "";

                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/20 transition-colors group"
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAddressCopy(fullAddress)}
                          className="font-suisse text-sm truncate hover:text-primary transition-colors flex items-center gap-1"
                          title="Click to copy address"
                        >
                          {item.title}
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        {item.isContract && (
                          <span className="text-xs text-primary bg-primary/20 px-1.5 py-0.5 rounded">
                            Contract
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatPercentage(item.value)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Holders Table */}
      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <h3 className="font-carbonic text-xl mb-4">Top Holders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-suisse text-sm text-gray-400">
                <th className="pb-4">Wallet</th>
                <th className="pb-4 text-right">Share</th>
                <th className="pb-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {tokenData?.analysis?.topHolders?.map((holder, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 font-suisse">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">
                        {formatAddress(holder.address)}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(holder.address)
                        }
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right font-carbonic">
                    {formatHolderPercentage(holder.percentage)}
                  </td>
                  <td className="py-4 text-right font-carbonic">
                    {formatNumber(Number(holder.balance))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
        <a
          href={`https://twitter.com/search?q=${tokenData.tokenSymbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-suisse flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">View on Twitter</span>
        </a>
        <a
          href={`https://flaunch.gg/base/coin/${tokenData?.contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-suisse flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Buy on Flaunch</span>
        </a>
      </div>
    </div>
  );
};
