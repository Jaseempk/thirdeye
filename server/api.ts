import { Holder, Deployer, TokenAnalysisData } from "@shared/schema";
import Moralis from "moralis";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

if (!process.env.MORALIS_API_KEY) {
  throw new Error("MORALIS_API_KEY is required");
}

if (!process.env.THEGRAPH_API_KEY) {
  throw new Error("THEGRAPH_API_KEY is required");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

if (!process.env.OPENAI_ORG_ID) {
  throw new Error("OPENAI_ORG_ID is required");
}

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const THEGRAPH_API_KEY = process.env.THEGRAPH_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG_ID,
});

const TokenAnalysis = z.object({
  result: z.object({
    score: z.number(),
    summary: z.string(),
  }),
  insights: z.array(z.string()),
});

async function generateAIAnalysis(analysisData: TokenAnalysisData) {
  try {
    const prompt = `Analyze this token data and provide EXACTLY 4 numbered insights. Score must be between 0 and 100:
    
    Token Info:
    - Holder Count: ${analysisData.holderCount}
    - Liquidity Score: ${analysisData.liquidityScore}
    - Contract Verified: ${analysisData.contractVerified}
    - Ownership Ratio: ${analysisData.ownershipRatio}%
    - Launched on Flaunch: ${analysisData.launchedOnFlaunch}
    
    Holder Statistics:
    - Top 10 Holders Own: ${analysisData.holderStatistics.holderSupply.top10.supplyPercent}%
    - Top 50 Holders Own: ${analysisData.holderStatistics.holderSupply.top50.supplyPercent}%
    - 24h Holder Change: ${analysisData.holderStatistics.holderChange["24h"].change} (${analysisData.holderStatistics.holderChange["24h"].changePercent}%)
    - 7d Holder Change: ${analysisData.holderStatistics.holderChange["7d"].change} (${analysisData.holderStatistics.holderChange["7d"].changePercent}%)
    
    Acquisition Methods:
    - Swap: ${analysisData.holderStatistics.holdersByAcquisition.swap}
    - Transfer: ${analysisData.holderStatistics.holdersByAcquisition.transfer}
    - Airdrop: ${analysisData.holderStatistics.holdersByAcquisition.airdrop}`;

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a token analysis assistant. Provide exactly 4 insights: 1) Holder count analysis, 2) Top 10 holders analysis, 3) Acquisition methods analysis, 4) Overall risk assessment. Each insight must be 1-2 sentences.",
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(TokenAnalysis, "token_analysis"),
    });

    const analysis = completion.choices[0].message.parsed;

    return {
      score: analysis?.result?.score ?? 0,
      insights: analysis?.insights ?? [],
      analysis: analysis?.result?.summary ?? "",
    };
  } catch (error: any) {
    console.error("Error generating AI analysis:", error);
    console.error("Full error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response?.data,
    });
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
}

const THEGRAPH_URL = `https://gateway.thegraph.com/api/${THEGRAPH_API_KEY}/subgraphs/id/bbWLZuPrmoskDaU64xycxZFE6EvSkMQALKkDpsz5ifF`;

// Initialize Moralis
Moralis.start({
  apiKey: MORALIS_API_KEY,
}).catch((error) => {
  console.error("Failed to initialize Moralis:", error);
  throw error;
});

export async function isTokenOnFlaunch(tokenAddress: string): Promise<boolean> {
  console.log("Checking if token is on Flaunch:", tokenAddress);
  try {
    // Instead of just checking pools, try to get full token info
    await getTokenInfo(tokenAddress);
    // If we get here, the token exists in Flaunch subgraph
    console.log("Token Flaunch status: true (found in subgraph)");
    return true;
  } catch (error) {
    // If getTokenInfo throws an error, token is not on Flaunch
    console.log("Token Flaunch status: false (not found in subgraph)");
    return false;
  }
}

export async function getTokenHolders(
  tokenAddress: string,
  chain = "base",
  cursor?: string
): Promise<{ holders: Holder[]; cursor?: string }> {
  try {
    console.log("Fetching token holders for address:", tokenAddress);
    const response = await Moralis.EvmApi.token.getTokenOwners({
      chain: "0x2105", // Base chain ID
      order: "DESC",
      tokenAddress: tokenAddress,
      limit: 100,
      cursor: cursor,
    });

    const data = response.toJSON();
    if (!data || !data.result) {
      throw new Error("Invalid response format from Moralis");
    }

    const holders = data.result.map((holder: any) => ({
      address: holder.owner_address || holder.address || "",
      balance: holder.balance || "0",
      percentage: holder.percentage_relative_to_total_supply
        ? parseFloat(holder.percentage_relative_to_total_supply)
        : 0,
      isContract: holder.is_contract || false,
      addressLabel: holder.owner_address_label,
    }));

    return {
      holders,
      cursor: data.cursor,
    };
  } catch (error: any) {
    console.error("Error fetching token holders:", error);
    throw new Error(`Failed to fetch token holders: ${error.message}`);
  }
}

export async function getHolderStatistics(tokenAddress: string): Promise<any> {
  try {
    console.log("Fetching holder statistics for address:", tokenAddress);
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/holders?chain=base`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      totalHolders: data.totalHolders,
      holdersByAcquisition: data.holdersByAcquisition,
      holderChange: data.holderChange,
      holderSupply: data.holderSupply,
    };
  } catch (error: any) {
    console.error("Error fetching holder statistics:", error);
    throw new Error(`Failed to fetch holder statistics: ${error.message}`);
  }
}

export async function getTokenInfo(tokenAddress: string): Promise<any> {
  try {
    console.log("Fetching token info from Flaunch subgraph...");
    const query = `
      query {
        tokenDayDatas(where: {token: "${tokenAddress.toLowerCase()}"}, first: 1) {
          priceETH
          totalFeesETH
          totalVolumeETH
          volumeETH
          pool {
            fairLaunchedEnded
            flipped
            liquidity
            totalFeesETH
            volumeETH
            bidWall {
              collectionToken {
                collection {
                  creator {
                    id
                  }
                  name
                  symbol
                }
                fairLaunch {
                  active
                  ends_at
                  ethEarned
                  initialSupply
                  soldInitialSupply
                }
                totalHolders
                totalSupply
                marketCapETH
                volumeETH
              }
            }
          }
        }
      }
    `;

    console.log("Making request to:", THEGRAPH_URL);
    console.log("With query:", query);

    const response = await fetch(THEGRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const data = await response.json();
    console.log("Token query raw response:", JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }

    if (!data.data?.tokenDayDatas || data.data.tokenDayDatas.length === 0) {
      console.log("No token data found in response");
      throw new Error("Token not found on Flaunch");
    }

    const tokenData = data.data.tokenDayDatas[0];
    const collectionToken = tokenData.pool.bidWall.collectionToken;
    const creatorId = collectionToken.collection.creator.id;

    const result = {
      raw: tokenData,
      formatted: {
        address: creatorId,
        flaunchStats: {
          totalCollections: 1,
          successfulLaunches: tokenData.pool.fairLaunchedEnded ? 1 : 0,
          potentialRugs: 0,
          firstLaunchDate: new Date().toISOString(),
          lastLaunchDate: new Date().toISOString(),
          averageRaised: parseFloat(
            collectionToken.fairLaunch.ethEarned || "0"
          ),
        },
        tokenInfo: {
          name: collectionToken.collection.name,
          symbol: collectionToken.collection.symbol,
          price: tokenData.priceETH,
          marketCap: collectionToken.marketCapETH,
          volume24h: tokenData.volumeETH,
          totalVolume: tokenData.totalVolumeETH,
          totalFees: tokenData.totalFeesETH,
          totalHolders: collectionToken.totalHolders,
          totalSupply: collectionToken.totalSupply,
        },
        fairLaunch: {
          active: collectionToken.fairLaunch.active,
          endsAt: collectionToken.fairLaunch.ends_at,
          ethEarned: collectionToken.fairLaunch.ethEarned,
          initialSupply: collectionToken.fairLaunch.initialSupply,
          soldInitialSupply: collectionToken.fairLaunch.soldInitialSupply,
        },
        poolStats: {
          liquidity: tokenData.pool.liquidity,
          fairLaunchedEnded: tokenData.pool.fairLaunchedEnded,
          flipped: tokenData.pool.flipped,
          totalFeesETH: tokenData.pool.totalFeesETH,
          volumeETH: tokenData.pool.volumeETH,
        },
      },
    };

    console.log("Processed token info:", result);
    return result;
  } catch (error: any) {
    console.error("Error fetching token info:", error);
    throw new Error(`Failed to fetch token info: ${error.message}`);
  }
}

export function calculateLiquidityScore(token: any): number {
  try {
    if (!token || !token.fairLaunch) return 0;

    // Base Liquidity Score (60% weight)
    const totalRaised = parseFloat(token.fairLaunch.totalRaised || "0");
    console.log("tootalRaaised:", totalRaised);
    const baseLiquidityScore = Math.min(60, (totalRaised / 1e18) * 20); // Scale based on ETH raised

    // Launch Status Score (20% weight)
    const launchStatusScore = token.fairLaunch.status === "COMPLETED" ? 20 : 0;

    // Holder Distribution Score (20% weight)
    const holderScore = token.tokenHoldings?.length
      ? Math.min(20, token.tokenHoldings.length)
      : 0;

    // Combine all scores
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
  // Calculate traditional score first
  let traditionalScore = 0;

  // Verified contract: 15 points
  if (analysis.contractVerified) traditionalScore += 15;

  // Liquidity score: 0-25 points
  traditionalScore += Math.min(25, analysis.liquidityScore / 4);

  // Ownership concentration: 0-20 points (lower is better)
  traditionalScore += Math.max(0, 20 - analysis.ownershipRatio / 5);

  // Launched on Flaunch: 10 points
  if (analysis.launchedOnFlaunch) traditionalScore += 10;

  // Deployer score: 0-30 points based on enhanced Flaunch history
  const deployerStats = analysis.deployer.flaunchStats;
  let deployerScore = 0;

  if (deployerStats) {
    if (deployerStats.totalCollections > 0) deployerScore += 5;

    const successRate =
      deployerStats.totalCollections > 0
        ? (deployerStats.successfulLaunches / deployerStats.totalCollections) *
          10
        : 0;
    deployerScore += successRate;

    const rugRatio =
      deployerStats.totalCollections > 0
        ? deployerStats.potentialRugs / deployerStats.totalCollections
        : 0;
    deployerScore += Math.max(0, 10 - rugRatio * 20);

    const averageRaisedScore = Math.min(
      5,
      (deployerStats.averageRaised / 1e18) * 2
    );
    deployerScore += averageRaisedScore;
  }

  traditionalScore += Math.min(30, deployerScore);
  traditionalScore = Math.min(100, Math.round(traditionalScore));

  try {
    // Get AI analysis
    const aiAnalysis = await generateAIAnalysis(analysis);

    // Combine traditional and AI scores (60% traditional, 40% AI)
    const finalScore = Math.round(
      traditionalScore * 0.6 + aiAnalysis.score * 0.4
    );

    return {
      score: Math.min(100, finalScore),
      aiAnalysis,
    };
  } catch (error: any) {
    console.error("Error in calculateScore:", error);
    if (error instanceof Error) {
      console.error("Full error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    // Fallback to traditional scoring if AI fails
    return {
      score: traditionalScore,
    };
  }
}
