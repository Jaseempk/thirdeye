import { ethers } from "ethers";
import { TokenAnalysisData, InsertTokenAnalysis } from "@shared/schema";
import { storage } from "../storage";
import { getTokenHolders, getHolderStatistics } from "./moralisService";
import { isTokenOnFlaunch, getTokenInfo } from "./tokenService";
import { calculateLiquidityScore, calculateScore } from "./scoringService";

export async function listAnalyses() {
  return storage.listAnalyses();
}

export async function getAnalysis(address: string) {
  return storage.getAnalysis(address);
}

export async function createAnalysis(data: InsertTokenAnalysis) {
  const { contractAddress } = data;

  // Parallelize independent operations
  const [code, tokenData, holderData, holderStats] = await Promise.all([
    // Get contract code
    new ethers.JsonRpcProvider("https://mainnet.base.org").getCode(
      contractAddress
    ),
    // Get token information
    getTokenInfo(contractAddress),
    // Get holder information
    getTokenHolders(contractAddress),
    // Get holder statistics
    getHolderStatistics(contractAddress),
  ]);

  const contractVerified = code !== "0x";
  const { holders: topHolders } = holderData;
  const liquidityScore = calculateLiquidityScore(tokenData.raw);

  // Calculate ownership concentration
  const ownershipRatio = topHolders.reduce(
    (sum, holder) => sum + holder.percentage,
    0
  );

  const analysis: {
    contractAddress: string;
    tokenName?: string;
    tokenSymbol?: string;
    createdAt: string;
    score: number;
    analysis: TokenAnalysisData;
  } = {
    contractAddress: data.contractAddress,
    tokenName: data.tokenName || undefined,
    tokenSymbol: data.tokenSymbol || undefined,
    createdAt: data.createdAt,
    score: 0,
    analysis: {
      holderCount: holderStats.totalHolders,
      liquidityScore,
      contractVerified,
      topHolders,
      ownershipRatio,
      deployer: tokenData.formatted,
      launchedOnFlaunch: Boolean(tokenData),
      holderStatistics: holderStats,
      metadata: tokenData?.metadata,
      aiAnalysis: undefined, // Initialize as undefined since it's optional
    },
  };

  // Calculate score and AI analysis
  const scoreResult = await calculateScore(analysis.analysis);
  analysis.score = scoreResult.score;

  // Only set aiAnalysis if it exists in the result
  if (scoreResult.aiAnalysis) {
    analysis.analysis.aiAnalysis = scoreResult.aiAnalysis;
  }

  return storage.createAnalysis(analysis);
}
