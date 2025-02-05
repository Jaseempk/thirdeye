import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TokenAnalysis } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalysisReport() {
  const { data: analyses, isLoading } = useQuery<TokenAnalysis[]>({
    queryKey: ["/api/analyses"]
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  if (!analyses?.length) {
    return (
      <Alert>
        <AlertDescription>No token analyses yet. Try analyzing a token first.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => (
        <Card key={analysis.id} className="w-full">
          <CardHeader>
            <CardTitle className="font-mono flex justify-between">
              <span>{analysis.tokenName} ({analysis.tokenSymbol})</span>
              <span className="text-accent">Score: {analysis.score}/100</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.score} className="mb-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Contract: {analysis.contractAddress.slice(0, 10)}...</div>
              <div>Holders: {analysis.analysis.holderCount}</div>
              <div>Liquidity Score: {analysis.analysis.liquidityScore}/100</div>
              <div>Verified: {analysis.analysis.contractVerified ? "Yes" : "No"}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
