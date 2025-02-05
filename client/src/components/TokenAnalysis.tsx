import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ethers } from "ethers";
import { getTokenInfo } from "@/lib/web3";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export function TokenAnalysis() {
  const [address, setAddress] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!window.ethereum) throw new Error("MetaMask not connected");
      if (!ethers.isAddress(address)) throw new Error("Invalid address");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const { name, symbol } = await getTokenInfo(address, provider);

      // Simulate token analysis
      const analysis = {
        contractAddress: address,
        tokenName: name,
        tokenSymbol: symbol,
        analysis: {
          holderCount: Math.floor(Math.random() * 1000),
          liquidityScore: Math.floor(Math.random() * 100),
          contractVerified: Math.random() > 0.5,
        },
        score: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
      };

      return apiRequest("POST", "/api/analyses", analysis);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      setAddress("");
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center font-mono text-2xl">Token Analysis</CardTitle>
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
  );
}