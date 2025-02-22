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
    const prompt = `Analyze this fresh meme token like a degen who lives in VR. Give me 4 brutal assessments (0-100) with meme factor:

    Token Stats:
    - Holder Count: ${analysisData.holderCount} degens
    - Liquidity Score: ${analysisData.liquidityScore} (1-100 how exit-able)
    - Contract Verified: ${
      analysisData.contractVerified
        ? "✅ Not a honeypot"
        : "🚩 Sketchy unsigned code"
    }
    - Top 10 Holders: ${
      analysisData.holderStatistics.holderSupply.top10.supplyPercent
    }% supply (${
      analysisData.holderStatistics.holderSupply.top50.supplyPercent
    }% for top 50)
    - Volume: ${analysisData.metadata.poolStats.volumeETH} ETH churn
    
    Meme Metrics:
    - Name: ${analysisData.metadata.name} ${
      analysisData.metadata.name.includes(" ") ? "🤮" : "✅"
    } (spaceless?)
    - Story: "${analysisData.metadata.description || "🚫 No narrative"}",
    - Social Proof: ${
      Object.values(analysisData.metadata.social).filter(Boolean).length
    } links (TG/Twitter/Discord)
    - Cultural Virus: ${
      analysisData.metadata.name?.match(/[a-z]{4,}/gi)?.length || 0
    } memeable words

    Assess through pixelated VR goggles:
    1) Exit Strategy - Liquidity depth vs whale dumping risk
    2) Meme DNA - Can this spark a cult? Relatability & meme potential
    3) Smoke Signals - Real community or bot farm?
    4) Degen Math - Risk/reward ratio for a 100x bag

    Response format (1-2 sentences per point):
      1) [🛑/🚀 Liquidity] 
      2) [💩/🌕 Meme Power]
      3) [🤖/❤️ Community Check]
      4) [⚖️ Final Verdict]
    Use emojis, degen slang, and meme references. Keep it real.`;

    const result = await model.generateContent(prompt);
    console.log("Result: ", result);
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
