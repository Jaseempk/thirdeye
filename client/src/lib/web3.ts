import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  // Base network chainId is 8453
  if (Number(network.chainId) !== 8453) {
    throw new Error("Please connect to Base network");
  }

  return provider;
}

export async function getTokenInfo(address: string, provider: ethers.Provider) {
  const abi = ["function name() view returns (string)", "function symbol() view returns (string)"];
  const contract = new ethers.Contract(address, abi, provider);

  try {
    const [name, symbol] = await Promise.all([
      contract.name(),
      contract.symbol()
    ]);
    return { name, symbol };
  } catch (error) {
    throw new Error("Invalid token contract");
  }
}