import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTokenAnalysisSchema, TokenAnalysisData } from "@shared/schema";
import {
  isTokenOnFlaunch,
  getTokenHolders,
  getTokenInfo,
  calculateScore,
  calculateLiquidityScore,
  getHolderStatistics,
} from "./api";
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
      console.log("Incoming request body:", req.body);

      const bodyWithTimestamp = {
        ...req.body,
        createdAt: new Date().toISOString(),
      };
      console.log("Request body with timestamp:", bodyWithTimestamp);

      const result = insertTokenAnalysisSchema.safeParse(bodyWithTimestamp);
      if (!result.success) {
        console.log("Validation errors:", result.error.errors);
        res.status(400).json({
          message: "Invalid request body",
          errors: result.error.errors,
        });
        return;
      }

      const { contractAddress } = result.data;

      // Get token information from blockchain
      console.log("Checking contract verification...");
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const code = await provider.getCode(contractAddress);
      const contractVerified = code !== "0x";
      console.log("Contract verified:", contractVerified);

      // Check if token was launched on Flaunch
      const launchedOnFlaunch = await isTokenOnFlaunch(contractAddress);

      // Get holder information and statistics
      console.log("Fetching token holders and statistics...");
      const { holders: topHolders } = await getTokenHolders(contractAddress);
      const holderStats = await getHolderStatistics(contractAddress);
      console.log(
        "Token holders and statistics fetched successfully. Processing data..."
      );

      // Calculate ownership concentration
      const ownershipRatio = topHolders.reduce(
        (sum, holder) => sum + holder.percentage,
        0
      );

      console.log("Calculating ownership ratio:", ownershipRatio);

      // Get token information from Flaunch subgraph
      console.log("Fetching token info...");
      const tokenData = await getTokenInfo(contractAddress);
      console.log("Token info fetched:", tokenData);

      console.log("Creating analysis object...");
      const liquidityScore = calculateLiquidityScore(tokenData.raw);

      const analysis: {
        contractAddress: string;
        tokenName?: string;
        tokenSymbol?: string;
        score: number;
        analysis: TokenAnalysisData;
        createdAt: string;
      } = {
        contractAddress: result.data.contractAddress,
        tokenName: result.data.tokenName || undefined,
        tokenSymbol: result.data.tokenSymbol || undefined,
        createdAt: result.data.createdAt,
        score: 0, // Will be updated with final score
        analysis: {
          holderCount: holderStats.totalHolders,
          liquidityScore,
          contractVerified,
          topHolders,
          ownershipRatio,
          deployer: tokenData.formatted,
          launchedOnFlaunch,
          holderStatistics: holderStats,
        },
      };

      // Calculate score and AI analysis
      const scoreResult = await calculateScore({
        holderCount: holderStats.totalHolders,
        liquidityScore,
        contractVerified,
        topHolders,
        ownershipRatio,
        deployer: tokenData.formatted,
        launchedOnFlaunch,
        holderStatistics: holderStats,
      });

      // Update the analysis with score and AI analysis
      analysis.score = scoreResult.score;
      if (scoreResult.aiAnalysis) {
        analysis.analysis.aiAnalysis = scoreResult.aiAnalysis;
      }

      console.log("Saving analysis to storage...");
      const savedAnalysis = await storage.createAnalysis(analysis);
      console.log("Analysis saved successfully");
      res.json(savedAnalysis);
    } catch (error: any) {
      console.error("Error analyzing token:", error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
