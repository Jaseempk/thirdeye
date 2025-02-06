import {
  tokenAnalyses,
  type TokenAnalysis,
  type InsertTokenAnalysis,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAnalysis(contractAddress: string): Promise<TokenAnalysis | undefined>;
  createAnalysis(analysis: InsertTokenAnalysis): Promise<TokenAnalysis>;
  listAnalyses(): Promise<TokenAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  async getAnalysis(
    contractAddress: string
  ): Promise<TokenAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(tokenAnalyses)
      .where(eq(tokenAnalyses.contractAddress, contractAddress));
    return analysis;
  }

  async createAnalysis(
    insertAnalysis: InsertTokenAnalysis
  ): Promise<TokenAnalysis> {
    console.log("Starting database insert for analysis...");
    try {
      console.log("Insert values:", {
        contractAddress: insertAnalysis.contractAddress,
        tokenName: insertAnalysis.tokenName,
        tokenSymbol: insertAnalysis.tokenSymbol,
        createdAt: insertAnalysis.createdAt,
      });

      const [analysis] = await db
        .insert(tokenAnalyses)
        .values({
          contractAddress: insertAnalysis.contractAddress,
          tokenName: insertAnalysis.tokenName || null,
          tokenSymbol: insertAnalysis.tokenSymbol || null,
          analysis: (insertAnalysis as any).analysis,
          score: (insertAnalysis as any).score,
          createdAt: insertAnalysis.createdAt,
        })
        .returning();
      console.log("Database insert completed successfully");
      return analysis;
    } catch (error) {
      console.error("Error during database insert:", error);
      throw error;
    }
  }

  async listAnalyses(): Promise<TokenAnalysis[]> {
    return db.select().from(tokenAnalyses);
  }
}

export const storage = new DatabaseStorage();
