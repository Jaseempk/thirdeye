import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TokenAnalysis } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { formatEther } from "ethers";

function formatBalance(balance: string): string {
  return Number(formatEther(balance)).toFixed(2);
}

export function AnalysisReport() {
  const { data: analyses, isLoading } = useQuery<TokenAnalysis[]>({
    queryKey: ["/api/analyses"],
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (!analyses?.length) {
    return (
      <Alert>
        <AlertDescription>
          No token analyses yet. Try analyzing a token first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => (
        <Card key={analysis.id} className="w-full">
          <CardHeader>
            <CardTitle className="font-mono flex justify-between">
              <span>{analysis.tokenName || 'Unknown Token'} ({analysis.tokenSymbol || 'Unknown'})</span>
              <span className="text-accent">Score: {analysis.score}/100</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={analysis.score} className="mb-4" />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Token Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono">Contract: {analysis.contractAddress.slice(0, 10)}...</div>
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
                  <div className="font-mono">Address: {analysis.analysis?.deployer?.address.slice(0, 10)}...</div>
                  <div>Total Deployments: {analysis.analysis?.deployer?.totalDeployments || 0}</div>
                  <div>Net Worth: {analysis.analysis?.deployer?.netWorth ? formatBalance(analysis.analysis.deployer.netWorth) : '0.00'} ETH</div>
                  <div>Previous Tokens: {analysis.analysis?.deployer?.previousTokens?.length || 0}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Top 10 Holders</h3>
              <div className="grid gap-2">
                {analysis.analysis?.topHolders?.map((holder, index) => (
                  <div key={holder.address} className="flex justify-between text-sm">
                    <span className="font-mono">{holder.address.slice(0, 10)}...</span>
                    <span>{holder.percentage?.toFixed(2) || '0.00'}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}