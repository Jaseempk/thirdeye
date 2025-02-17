import { TokenAnalysisData } from "@shared/schema";
import { generateAIAnalysis } from "./aiService";

export function calculateLiquidityScore(token: any): number {
  try {
    console.log(
      "Calculating liquidity score for token:",
      JSON.stringify(token, null, 2)
    );

    const fairLaunch = token?.pool?.bidWall?.collectionToken?.fairLaunch;
    if (!token || !fairLaunch) {
      console.log("Early return: token or fairLaunch is missing", {
        hasToken: !!token,
        hasFairLaunch: !!fairLaunch,
      });
      return 0;
    }

    // Check if fairlaunch is still active
    if (fairLaunch.active) {
      console.log("Fairlaunch is still active");
      return 0;
    }

    const totalRaised = parseFloat(fairLaunch.ethEarned || "0");
    console.log("Total raised:", {
      raw: fairLaunch.ethEarned,
      parsed: totalRaised,
    });

    const baseLiquidityScore = Math.min(60, (totalRaised / 1e18) * 20);
    console.log("Base liquidity score:", {
      calculation: `min(60, (${totalRaised} / 1e18) * 20)`,
      result: baseLiquidityScore,
    });

    const launchStatusScore = !fairLaunch.active && fairLaunch.ends_at ? 20 : 0;
    console.log("Launch status score:", {
      status: fairLaunch.active ? "ACTIVE" : "COMPLETED",
      score: launchStatusScore,
    });

    const holderScore = token.pool.bidWall.collectionToken.totalHolders
      ? Math.min(20, token.pool.bidWall.collectionToken.totalHolders / 10)
      : 0;
    console.log("Holder score:", {
      holdingsLength: token.pool.bidWall.collectionToken.totalHolders || 0,
      score: holderScore,
    });

    const totalScore = Math.round(
      baseLiquidityScore + launchStatusScore + holderScore
    );
    console.log("Final score calculation:", {
      baseLiquidityScore,
      launchStatusScore,
      holderScore,
      totalBeforeClamp: totalScore,
      finalScore: Math.min(100, Math.max(0, totalScore)),
    });

    return Math.min(100, Math.max(0, totalScore));
  } catch (error) {
    console.error("Error calculating liquidity score:", {
      error,
      token: JSON.stringify(token, null, 2),
    });
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
  // Check if fairlaunch is still active from metadata
  const fairLaunchActive =
    analysis.metadata?.poolStats?.fairLaunchedEnded === false;
  if (fairLaunchActive) {
    return {
      score: 0,
      aiAnalysis: {
        score: 0,
        insights: ["Fairlaunch still going on"],
        analysis:
          "Fairlaunch still going on - Analysis will be available after the fairlaunch ends",
      },
    };
  }

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
function calculateDeployerScore(
  deployerStats: DeployerStats | undefined
): number {
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
  const rugRatio =
    stats.totalCollections > 0
      ? stats.potentialRugs / stats.totalCollections
      : 0;
  return Math.max(0, 10 - rugRatio * 20);
}

function calculateRaisedScore(stats: DeployerStats): number {
  return Math.min(5, (stats.averageRaised / 1e18) * 2);
}
