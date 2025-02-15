import { TokenAnalysisData } from "@shared/schema";
import { generateAIAnalysis } from "./aiService";

export function calculateLiquidityScore(token: any): number {
  try {
    if (!token || !token.fairLaunch) return 0;

    const totalRaised = parseFloat(token.fairLaunch.totalRaised || "0");
    const baseLiquidityScore = Math.min(60, (totalRaised / 1e18) * 20);
    const launchStatusScore = token.fairLaunch.status === "COMPLETED" ? 20 : 0;
    const holderScore = token.tokenHoldings?.length
      ? Math.min(20, token.tokenHoldings.length)
      : 0;

    const totalScore = Math.round(
      baseLiquidityScore + launchStatusScore + holderScore
    );
    return Math.min(100, Math.max(0, totalScore));
  } catch (error) {
    console.error("Error calculating liquidity score:", error);
    return 0;
  }
}

export async function calculateScore(analysis: TokenAnalysisData): Promise<{
  score: number;
  aiAnalysis?: {
    score: number;
    insights: string[];
    analysis: string;
  };
}> {
  const traditionalScore = calculateTraditionalScore(analysis);

  try {
    const aiAnalysis = await generateAIAnalysis(analysis);
    const finalScore = Math.round(
      traditionalScore * 0.6 + aiAnalysis.score * 0.4
    );

    return {
      score: Math.min(100, finalScore),
      aiAnalysis,
    };
  } catch (error: any) {
    console.error("Error in calculateScore:", error);
    return {
      score: traditionalScore,
    };
  }
}

interface DeployerStats {
  totalCollections: number;
  successfulLaunches: number;
  potentialRugs: number;
  averageRaised: number;
  firstLaunchDate?: string;
  lastLaunchDate?: string;
}

function calculateTraditionalScore(analysis: TokenAnalysisData): number {
  let score = 0;

  // Base scores
  if (analysis.contractVerified) score += 15;
  score += Math.min(25, analysis.liquidityScore / 4);
  score += Math.max(0, 20 - analysis.ownershipRatio / 5);
  if (analysis.launchedOnFlaunch) score += 10;

  // Deployer score
  const deployerStats = analysis?.deployer?.flaunchStats;
  if (deployerStats) {
    score += calculateDeployerScore(deployerStats);
  }

  return Math.min(100, Math.round(score));
}

// Update function signature to handle undefined case
function calculateDeployerScore(deployerStats: DeployerStats | undefined): number {
  if (!deployerStats) return 0;

  let score = 0;

  if (deployerStats.totalCollections > 0) {
    score += 5;
    score += calculateSuccessRate(deployerStats);
    score += calculateRugScore(deployerStats);
    score += calculateRaisedScore(deployerStats);
  }

  return Math.min(30, score);
}

function calculateSuccessRate(stats: DeployerStats): number {
  return stats.totalCollections > 0
    ? (stats.successfulLaunches / stats.totalCollections) * 10
    : 0;
}

function calculateRugScore(stats: DeployerStats): number {
  const rugRatio = stats.totalCollections > 0
    ? stats.potentialRugs / stats.totalCollections
    : 0;
  return Math.max(0, 10 - rugRatio * 20);
}

function calculateRaisedScore(stats: DeployerStats): number {
  return Math.min(5, (stats.averageRaised / 1e18) * 2);
}