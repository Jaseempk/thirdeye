import { ethers } from 'ethers';

export async function getTokenInfo(address: string, provider: ethers.Provider) {
  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  ];
  const contract = new ethers.Contract(address, abi, provider);

  try {
    const [name, symbol] = await Promise.all([
      contract.name(),
      contract.symbol(),
    ]);
    return { name, symbol };
  } catch (error) {
    console.log("error:", error);
    throw new Error("Invalid token contract");
  }
}