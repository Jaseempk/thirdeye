import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { TokenAnalysis } from "@shared/schema";
import { formatEther } from "ethers";
import { Portal } from "@radix-ui/react-portal";

function formatBalance(balance: string): string {
  return Number(formatEther(balance)).toFixed(2);
}

interface AnalysisDialogProps {
  analysis: TokenAnalysis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisDialog({
  analysis,
  open,
  onOpenChange,
}: AnalysisDialogProps) {
  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl flex justify-between items-center">
            <span>
              {analysis.tokenName || "Unknown Token"} (
              {analysis.tokenSymbol || "Unknown"})
            </span>
            <span className="text-accent flex items-center gap-2">
              Score: {analysis.score}/100
              <HoverCard>
                <HoverCardTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </HoverCardTrigger>
                <Portal>
                  <HoverCardContent
                    side="top"
                    align="center"
                    className="w-80 z-[60]"
                    sideOffset={16}
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold">Score Calculation</h4>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">Traditional Score (60%):</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Contract verification: 15 points</li>
                          <li>Liquidity assessment: 0-25 points</li>
                          <li>Ownership concentration: 0-20 points</li>
                          <li>Flaunch launch: 10 points</li>
                          <li>Deployer history: 0-30 points</li>
                        </ul>
                        <p className="font-medium mt-2">
                          AI Analysis Score (40%):
                        </p>
                        <p>
                          Based on comprehensive analysis of growth, liquidity,
                          verification, ownership patterns, and deployer
                          reputation.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </Portal>
              </HoverCard>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {analysis.analysis.aiAnalysis && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">AI Analysis</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  {analysis.analysis.aiAnalysis.analysis}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Key Insights:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {analysis.analysis.aiAnalysis.insights.map((insight, i) => (
                      <li key={i} className="text-sm">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <Progress value={analysis.score} className="mb-4" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Token Info</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono">
                  Contract: {analysis.contractAddress}
                </div>
                <div>Holders: {analysis.analysis?.holderCount || 0}</div>
                <div className="flex items-center gap-2">
                  Liquidity Score: {analysis.analysis?.liquidityScore || 0}/100
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <Portal>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="w-80 z-[60]"
                        sideOffset={16}
                      >
                        <div className="space-y-2">
                          <h4 className="font-semibold">
                            Liquidity Score Calculation
                          </h4>
                          <div className="text-sm space-y-1">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>
                                Base Liquidity (60%): Calculated from ETH raised
                              </li>
                              <li>
                                Launch Status (20%): Full points for completed
                                launch
                              </li>
                              <li>
                                Holder Distribution (20%): Based on number of
                                holders
                              </li>
                            </ul>
                            <p className="mt-2 text-muted-foreground">
                              Higher scores indicate better liquidity and
                              stability.
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </Portal>
                  </HoverCard>
                </div>
                <div>
                  Contract Verified:{" "}
                  {analysis.analysis?.contractVerified ? "Yes" : "No"}
                </div>
                <div>
                  Launched on Flaunch:{" "}
                  {analysis.analysis?.launchedOnFlaunch ? "Yes" : "No"}
                </div>
                <div>
                  Ownership Concentration:{" "}
                  {analysis.analysis?.ownershipRatio?.toFixed(2) || "0.00"}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Deployer Info</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono">
                  Address: {analysis.analysis?.deployer?.address}
                </div>
                <div>
                  Total Collections:{" "}
                  {analysis.analysis?.deployer?.flaunchStats
                    ?.totalCollections || 0}
                </div>
                <div>
                  Successful Launches:{" "}
                  {analysis.analysis?.deployer?.flaunchStats
                    ?.successfulLaunches || 0}
                </div>
                <div>
                  Success Rate:{" "}
                  {analysis.analysis?.deployer?.flaunchStats?.totalCollections
                    ? ((analysis.analysis?.deployer?.flaunchStats
                        ?.successfulLaunches || 0) /
                        analysis.analysis?.deployer?.flaunchStats
                          ?.totalCollections) *
                      100
                    : 0}
                  %
                </div>
                {analysis.analysis?.deployer?.flaunchStats?.firstLaunchDate && (
                  <div>
                    First Launch:{" "}
                    {new Date(
                      analysis.analysis.deployer.flaunchStats.firstLaunchDate
                    ).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Holder Statistics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Distribution</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Top 10 Holders:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderSupply
                          ?.top10?.supplyPercent || 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 25 Holders:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderSupply
                          ?.top25?.supplyPercent || 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 50 Holders:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderSupply
                          ?.top50?.supplyPercent || 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 100 Holders:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderSupply
                          ?.top100?.supplyPercent || 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Holder Changes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last 24h:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderChange?.[
                          "24h"
                        ]?.change || 0}{" "}
                        (
                        {analysis.analysis?.holderStatistics?.holderChange?.[
                          "24h"
                        ]?.changePercent || 0}
                        %)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last 7d:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderChange?.[
                          "7d"
                        ]?.change || 0}{" "}
                        (
                        {analysis.analysis?.holderStatistics?.holderChange?.[
                          "7d"
                        ]?.changePercent || 0}
                        %)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last 30d:</span>
                      <span>
                        {analysis.analysis?.holderStatistics?.holderChange?.[
                          "30d"
                        ]?.change || 0}{" "}
                        (
                        {analysis.analysis?.holderStatistics?.holderChange?.[
                          "30d"
                        ]?.changePercent || 0}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">
                Acquisition Methods
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-semibold">
                    {analysis.analysis?.holderStatistics?.holdersByAcquisition
                      ?.swap || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Swap</div>
                </div>
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-semibold">
                    {analysis.analysis?.holderStatistics?.holdersByAcquisition
                      ?.transfer || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Transfer</div>
                </div>
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-semibold">
                    {analysis.analysis?.holderStatistics?.holdersByAcquisition
                      ?.airdrop || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Airdrop</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Top Holders</h3>
              <div className="grid gap-2">
                {analysis.analysis?.topHolders?.map((holder) => (
                  <div
                    key={holder.address}
                    className="flex justify-between items-center text-sm p-2 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{holder.address}</span>
                      {holder.addressLabel && (
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                          {holder.addressLabel}
                        </span>
                      )}
                      {holder.isContract && (
                        <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
                          Contract
                        </span>
                      )}
                    </div>
                    <span>{holder.percentage?.toFixed(2) || "0.00"}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
