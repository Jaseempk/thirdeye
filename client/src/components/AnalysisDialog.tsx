import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { TokenAnalysis } from "@shared/schema";
import { formatEther } from "ethers";

function formatBalance(balance: string): string {
  return Number(formatEther(balance)).toFixed(2);
}

interface AnalysisDialogProps {
  analysis: TokenAnalysis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisDialog({ analysis, open, onOpenChange }: AnalysisDialogProps) {
  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl flex justify-between items-center">
            <span>{analysis.tokenName || 'Unknown Token'} ({analysis.tokenSymbol || 'Unknown'})</span>
            <span className="text-accent">Score: {analysis.score}/100</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={analysis.score} className="mb-4" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Token Info</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono">Contract: {analysis.contractAddress}</div>
                <div>Holders: {analysis.analysis?.holderCount || 0}</div>
                <div>Liquidity Score: {analysis.analysis?.liquidityScore || 0}/100</div>
                <div>Contract Verified: {analysis.analysis?.contractVerified ? "Yes" : "No"}</div>
                <div>Launched on Flaunch: {analysis.analysis?.launchedOnFlaunch ? "Yes" : "No"}</div>
                <div>Ownership Concentration: {analysis.analysis?.ownershipRatio?.toFixed(2) || '0.00'}%</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Deployer Info</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono">Address: {analysis.analysis?.deployer?.address}</div>
                <div>Total Deployments: {analysis.analysis?.deployer?.totalDeployments || 0}</div>
                <div>Net Worth: {analysis.analysis?.deployer?.netWorth ? formatBalance(analysis.analysis.deployer.netWorth) : '0.00'} ETH</div>
                <div>Previous Tokens: {analysis.analysis?.deployer?.previousTokens?.length || 0}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Top 10 Holders</h3>
            <div className="grid gap-2">
              {analysis.analysis?.topHolders?.map((holder) => (
                <div key={holder.address} className="flex justify-between text-sm">
                  <span className="font-mono">{holder.address}</span>
                  <span>{holder.percentage?.toFixed(2) || '0.00'}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
