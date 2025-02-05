import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ethers } from "ethers";
import { getTokenInfo } from "@/lib/web3";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import type { TokenAnalysis as TokenAnalysisType } from "@shared/schema";
import { AnalysisDialog } from "./AnalysisDialog";

export function TokenAnalysisForm() {
  const [address, setAddress] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<TokenAnalysisType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!window.ethereum) throw new Error("MetaMask not connected");
      if (!ethers.isAddress(address)) throw new Error("Invalid address");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const { name, symbol } = await getTokenInfo(address, provider);

      const response = await apiRequest("POST", "/api/analyses", {
        contractAddress: address,
        tokenName: name,
        tokenSymbol: symbol,
        createdAt: new Date().toISOString(),
      });

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      setCurrentAnalysis(data);
      setDialogOpen(true);
      setAddress("");
    },
  });

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center font-mono text-2xl">
            Flaunch Token Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Token Contract Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono"
            />
            <Button onClick={() => mutate()} disabled={isPending || !address}>
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnalysisDialog
        analysis={currentAnalysis}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}