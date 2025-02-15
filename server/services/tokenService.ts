import { THEGRAPH_URL } from "./config";

export async function isTokenOnFlaunch(tokenAddress: string): Promise<boolean> {
  console.log("Checking if token is on Flaunch:", tokenAddress);
  try {
    await getTokenInfo(tokenAddress);
    console.log("Token Flaunch status: true (found in subgraph)");
    return true;
  } catch (error) {
    console.log("Token Flaunch status: false (not found in subgraph)");
    return false;
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

    const response = await fetch(THEGRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }

    if (!data.data?.tokenDayDatas || data.data.tokenDayDatas.length === 0) {
      throw new Error("Token not found on Flaunch");
    }

    return formatTokenInfo(data.data.tokenDayDatas[0]);
  } catch (error: any) {
    console.error("Error fetching token info:", error);
    throw new Error(`Failed to fetch token info: ${error.message}`);
  }
}

function formatTokenInfo(tokenData: any) {
  const collectionToken = tokenData.pool.bidWall.collectionToken;
  const creatorId = collectionToken.collection.creator.id;

  return {
    raw: tokenData,
    formatted: {
      address: creatorId,
      flaunchStats: {
        totalCollections: 1,
        successfulLaunches: tokenData.pool.fairLaunchedEnded ? 1 : 0,
        potentialRugs: 0,
        firstLaunchDate: new Date().toISOString(),
        lastLaunchDate: new Date().toISOString(),
        averageRaised: parseFloat(collectionToken.fairLaunch.ethEarned || "0"),
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
}