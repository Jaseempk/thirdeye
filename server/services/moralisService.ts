import Moralis from "moralis";
import { Holder } from "@shared/schema";
import { MORALIS_API_KEY } from "./config";

// Initialize Moralis
Moralis.start({
  apiKey: MORALIS_API_KEY,
}).catch((error) => {
  console.error("Failed to initialize Moralis:", error);
  throw error;
});

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