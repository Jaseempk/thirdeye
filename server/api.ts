import { Holder, Deployer } from "@shared/schema";
import Moralis from 'moralis';

if (!process.env.MORALIS_API_KEY) {
  throw new Error("MORALIS_API_KEY is required");
}

if (!process.env.THEGRAPH_API_KEY) {
  throw new Error("THEGRAPH_API_KEY is required");
}

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const THEGRAPH_API_KEY = process.env.THEGRAPH_API_KEY;
const THEGRAPH_URL = `https://gateway.thegraph.com/api/${THEGRAPH_API_KEY}/subgraphs/id/bbWLZuPrmoskDaU64xycxZFE6EvSkMQALKkDpsz5ifF`;

// Initialize Moralis
await Moralis.start({
  apiKey: MORALIS_API_KEY
});

export async function isTokenOnFlaunch(tokenAddress: string): Promise<boolean> {
  const query = `
    query {
      pools(where: { id: "${tokenAddress.toLowerCase()}" }) {
        id
      }
    }
  `;

  const response = await fetch(THEGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.data.pools.length > 0;
}

export async function getTokenHolders(
  tokenAddress: string,
  chain = "base"
): Promise<{ holders: Holder[]; totalHolders: number }> {
  try {
    const response = await Moralis.EvmApi.token.getTokenOwners({
      "chain": "0x2105", // Base chain ID
      "order": "DESC",
      "tokenAddress": tokenAddress,
      "limit": 10
    });

    console.log("Token holders raw response:", JSON.stringify(response.raw, null, 2));

    if (!response.raw || !Array.isArray(response.raw.result)) {
      throw new Error("Invalid response format from Moralis");
    }

    const holders = response.raw.result.map((holder: any) => ({
      address: holder.owner_address || holder.address || "",
      balance: holder.balance || "0",
      percentage: parseFloat(holder.percentage_relative_to_total_supply || "0"),
    }));

    return {
      holders,
      totalHolders: response.raw.total || holders.length,
    };
  } catch (error: any) {
    console.error("Error fetching token holders:", error);
    throw new Error(`Failed to fetch token holders: ${error.message}`);
  }
}

export async function getDeployerInfo(
  deployerAddress: string,
  chain = "base"
): Promise<Deployer> {
  try {
    // Get wallet net worth
    const netWorthResponse = await Moralis.EvmApi.wallets.getWalletNetWorth({
      address: deployerAddress,
      excludeSpam: true,
      excludeUnverifiedContracts: true
    });

    // Get wallet history for deployments
    const historyResponse = await Moralis.EvmApi.wallets.getWalletHistory({
      chain: "0x2105",
      address: deployerAddress
    });

    // Filter for contract deployments
    const deployments = (historyResponse.raw.result || []).filter((tx: any) => 
      tx.to_address === null && tx.input !== "0x"
    );

    return {
      address: deployerAddress,
      totalDeployments: deployments.length,
      netWorth: (netWorthResponse.raw.total_usd || "0").toString(),
      previousTokens: deployments.map((tx: any) => tx.contract_address || "").filter(Boolean),
    };
  } catch (error: any) {
    console.error("Error fetching deployer info:", error);
    throw new Error(`Failed to fetch deployer info: ${error.message}`);
  }
}

export function calculateScore(analysis: {
  contractVerified: boolean;
  liquidityScore: number;
  ownershipRatio: number;
  launchedOnFlaunch: boolean;
  deployer: Deployer;
}): number {
  let score = 0;

  // Verified contract: 20 points
  if (analysis.contractVerified) score += 20;

  // Liquidity score: 0-25 points
  score += Math.min(25, analysis.liquidityScore / 4);

  // Ownership concentration: 0-20 points (lower is better)
  score += Math.max(0, 20 - analysis.ownershipRatio / 5);

  // Launched on Flaunch: 15 points
  if (analysis.launchedOnFlaunch) score += 15;

  // Deployer score: 0-20 points
  const deployerScore = Math.min(20, Math.max(0, 
    10 + // Base score
    (analysis.deployer.totalDeployments > 0 ? 5 : 0) + // Has deployment history
    (Number(analysis.deployer.netWorth) > 1e18 ? 5 : 0) // Has significant assets
  ));
  score += deployerScore;

  return Math.min(100, Math.round(score));
}