import { ethers } from "ethers";
import { TokenAnalysisData, InsertTokenAnalysis } from "@shared/schema";
import { storage } from "../storage";
import {
  getTokenHolders,
  getHolderStatistics,
} from "./moralisService";
import {
  isTokenOnFlaunch,
  getTokenInfo,
} from "./tokenService";
import {
  calculateLiquidityScore,
  calculateScore,
} from "./scoringService";

export async function listAnalyses() {
  return storage.listAnalyses();
}

export async function getAnalysis(address: string) {
  return storage.getAnalysis(address);
}

export async function createAnalysis(data: InsertTokenAnalysis) {
  const { contractAddress } = data;

  // Get token information from blockchain
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const code = await provider.getCode(contractAddress);
  const contractVerified = code !== "0x";

  // Check if token was launched on Flaunch
  const launchedOnFlaunch = await isTokenOnFlaunch(contractAddress);

  // Get holder information and statistics
  const { holders: topHolders } = await getTokenHolders(contractAddress);
  const holderStats = await getHolderStatistics(contractAddress);

  // Calculate ownership concentration
  const ownershipRatio = topHolders.reduce(
    (sum, holder) => sum + holder.percentage,
    0
  );

  // Get token information from Flaunch subgraph
  const tokenData = await getTokenInfo(contractAddress);
  const liquidityScore = calculateLiquidityScore(tokenData.raw);

  const analysis: {
    contractAddress: string;
    tokenName?: string;
    tokenSymbol?: string;
    score: number;
    analysis: TokenAnalysisData;
    createdAt: string;
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
      launchedOnFlaunch,
      holderStatistics: holderStats,
    },
  };

  // Calculate score and AI analysis
  const scoreResult = await calculateScore(analysis.analysis);

  // Update the analysis with score and AI analysis
  analysis.score = scoreResult.score;
  if (scoreResult.aiAnalysis) {
    analysis.analysis.aiAnalysis = scoreResult.aiAnalysis;
  }

  return storage.createAnalysis(analysis);
}