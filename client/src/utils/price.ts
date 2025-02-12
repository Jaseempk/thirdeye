import { z } from "zod";

const coingeckoResponseSchema = z.object({
  ethereum: z.object({
    usd: z.number(),
  }),
});

export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = coingeckoResponseSchema.parse(data);

    return validatedData.ethereum.usd;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error;
  }
}
