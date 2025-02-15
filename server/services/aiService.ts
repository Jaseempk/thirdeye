import { TokenAnalysisData } from "@shared/schema";
import { z } from "zod";
import { openai } from "./config";
import { zodResponseFormat } from "openai/helpers/zod";

const TokenAnalysis = z.object({
  result: z.object({
    score: z.number(),
    summary: z.string(),
  }),
  insights: z.array(z.string()),
});

export async function generateAIAnalysis(analysisData: TokenAnalysisData) {
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