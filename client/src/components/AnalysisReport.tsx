import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TokenAnalysis } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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
          <CardContent className="py-6">
            <div className="flex justify-between items-center">
              <div className="font-mono">
                <div>{analysis.tokenName || 'Unknown Token'}</div>
                <div className="text-sm text-muted-foreground">{analysis.contractAddress.slice(0, 10)}...</div>
              </div>
              <div className="text-xl font-bold text-accent">
                {analysis.score}/100
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}