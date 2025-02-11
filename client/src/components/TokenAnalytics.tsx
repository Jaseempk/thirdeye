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
      <div className="p-6">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter token address..."
              className="flex-1 bg-black/20 border border-primary/20 rounded-lg px-4 py-2 text-white font-suisse"
            />
            <button
              onClick={() => onAnalyze(searchAddress)}
              disabled={isLoading}
              className="bg-primary px-6 py-2 rounded-lg font-suisse flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error && (
            <div className="text-red-400 font-suisse text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-gray-400 font-suisse text-sm">
                Analyzing token data...
              </p>
              <p className="text-gray-500 font-suisse text-xs mt-2">
                This might take a few moments
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Header */}
      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-carbonic text-3xl">{tokenData?.tokenName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400 font-suisse">
                ${tokenData?.tokenSymbol}
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(tokenData?.contractAddress)
                }
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-carbonic bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              {formatPercentage(tokenData.score)}
            </div>
            <p className="text-sm text-gray-400 font-suisse">Safety Score</p>
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
              <span>
                {formatNumber(
                  Number(tokenData.analysis?.deployer?.tokenInfo?.marketCap)
                )}{" "}
                ETH
              </span>
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
      <div className="flex gap-4">
        <a
          href={`https://twitter.com/search?q=${tokenData.tokenSymbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors px-6 py-3 rounded-lg font-suisse flex items-center justify-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          View on Twitter
        </a>
        <a
          href={`https://flaunch.gg/base/coin/${tokenData?.contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-suisse flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Buy on Flaunch
        </a>
      </div>
    </div>
  );
};
