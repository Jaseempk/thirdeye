import { TokenAnalysisData } from "@shared/schema";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    result: {
      type: SchemaType.OBJECT,
      properties: {
        score: {
          type: SchemaType.NUMBER,
          description: "Analysis score between 0 and 100",
        },
        summary: {
          type: SchemaType.STRING,
          description: "Overall analysis summary",
        },
      },
      required: ["score", "summary"],
    },
    insights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "Individual analysis insights",
      },
    },
  },
  required: ["result", "insights"],
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite-preview-02-05",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
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
    - Airdrop: ${analysisData.holderStatistics.holdersByAcquisition.airdrop}

    Provide the analysis in this exact format:
    1) Holder count analysis
    2) Top 10 holders analysis
    3) Acquisition methods analysis
    4) Overall risk assessment
    Each insight must be 1-2 sentences.`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    return {
      score: response.result.score,
      insights: response.insights,
      analysis: response.result.summary,
    };
  } catch (error: any) {
    console.error("Error generating AI analysis:", error);
    console.error("Full error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
}
