import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTokenAnalysisSchema } from "@shared/schema";
import { isTokenOnFlaunch, getTokenHolders, getDeployerInfo, calculateScore } from "./api";
import { ethers } from "ethers";

export function registerRoutes(app: Express): Server {
  app.get("/api/analyses", async (_req, res) => {
    const analyses = await storage.listAnalyses();
    res.json(analyses);
  });

  app.get("/api/analyses/:address", async (req, res) => {
    const analysis = await storage.getAnalysis(req.params.address);
    if (!analysis) {
      res.status(404).json({ message: "Analysis not found" });
      return;
    }
    res.json(analysis);
  });

  app.post("/api/analyses", async (req, res) => {
    try {
      const result = insertTokenAnalysisSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      const { contractAddress } = result.data;

      // Get token information from blockchain
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const code = await provider.getCode(contractAddress);
      const contractVerified = code !== "0x";

      // Check if token was launched on Flaunch
      const launchedOnFlaunch = await isTokenOnFlaunch(contractAddress);

      // Get holder information
      const { holders: topHolders, totalHolders: holderCount } = await getTokenHolders(contractAddress);

      // Calculate ownership concentration
      const ownershipRatio = topHolders.reduce((sum, holder) => sum + holder.percentage, 0);

      // Get deployer information from Moralis
      const deployerAddress = await provider.getTransactionReceipt(code)
        .then(receipt => receipt?.from || ethers.ZeroAddress);
      const deployer = await getDeployerInfo(deployerAddress);

      const analysis = {
        ...result.data,
        analysis: {
          holderCount,
          liquidityScore: Math.floor(Math.random() * 100), // This should be calculated based on actual liquidity data
          contractVerified,
          topHolders,
          ownershipRatio,
          deployer,
          launchedOnFlaunch,
        },
        score: calculateScore({
          contractVerified,
          liquidityScore: Math.floor(Math.random() * 100),
          ownershipRatio,
          launchedOnFlaunch,
          deployer,
        }),
      };

      const savedAnalysis = await storage.createAnalysis(analysis);
      res.json(savedAnalysis);
    } catch (error: any) {
      console.error("Error analyzing token:", error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}