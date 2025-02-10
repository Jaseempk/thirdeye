import { readContract } from "@wagmi/core";
import { config } from "../providers/Web3Provider";
import { abi } from "../tokenAbi/flaunchiabi";

export async function getTokenInfo(address: string) {
  try {
    const tokenName = await readContract(config, {
      abi,
      address: address as `0x${string}`,
      functionName: "name",
    });
    console.log("tokenName:", tokenName);
    const tokenSymbol = await readContract(config, {
      abi,
      address: address as `0x${string}`,
      functionName: "symbol",
    });

    return { tokenName, tokenSymbol };
  } catch (error) {
    console.log("error:", error);
    throw new Error("Invalid token contract");
  }
}
