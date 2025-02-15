import OpenAI from "openai";

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

export const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
export const THEGRAPH_API_KEY = process.env.THEGRAPH_API_KEY;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID;

export const THEGRAPH_URL = `https://gateway.thegraph.com/api/${THEGRAPH_API_KEY}/subgraphs/id/bbWLZuPrmoskDaU64xycxZFE6EvSkMQALKkDpsz5ifF`;

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG_ID,
});