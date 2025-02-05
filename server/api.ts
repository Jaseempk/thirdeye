import { Holder, Deployer } from "@shared/schema";

if (!process.env.MORALIS_API_KEY) {
  throw new Error("MORALIS_API_KEY is required");
}

if (!process.env.THEGRAPH_API_KEY) {
  throw new Error("THEGRAPH_API_KEY is required");
}

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const THEGRAPH_API_KEY = process.env.THEGRAPH_API_KEY;
const THEGRAPH_URL = `https://gateway.thegraph.com/api/${THEGRAPH_API_KEY}/subgraphs/id/bbWLZuPrmoskDaU64xycxZFE6EvSkMQALKkDpsz5ifF`;

export async function isTokenOnFlaunch(tokenAddress: string): Promise<boolean> {
  const query = `
    query {
      tokens(where: { id: "${tokenAddress.toLowerCase()}" }) {
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
  return data.data.tokens.length > 0;
}

export async function getTokenHolders(
  tokenAddress: string,
  chain = "base"
): Promise<{ holders: Holder[]; totalHolders: number }> {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}/token_holders?chain=${chain}&limit=10`,
    {
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    }
  );

  const data = await response.json();
  const totalSupply = data.total_supply;

  const holders = data.result.map((holder: any) => ({
    address: holder.address,
    balance: holder.balance,
    percentage: (Number(holder.balance) / Number(totalSupply)) * 100,
  }));

  return {
    holders,
    totalHolders: data.total,
  };
}

export async function getDeployerInfo(
  deployerAddress: string,
  chain = "base"
): Promise<Deployer> {
  // Get deployer's token contracts
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/${deployerAddress}/erc20?chain=${chain}`,
    {
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    }
  );

  const data = await response.json();
  
  // Get deployer's net worth (native token balance)
  const balanceResponse = await fetch(
    `https://deep-index.moralis.io/api/v2/${deployerAddress}/balance?chain=${chain}`,
    {
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    }
  );

  const balanceData = await balanceResponse.json();

  return {
    address: deployerAddress,
    totalDeployments: data.length,
    netWorth: balanceData.balance,
    previousTokens: data.map((token: any) => token.token_address),
  };
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
