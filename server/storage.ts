import { tokenAnalyses, type TokenAnalysis, type InsertTokenAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAnalysis(contractAddress: string): Promise<TokenAnalysis | undefined>;
  createAnalysis(analysis: InsertTokenAnalysis): Promise<TokenAnalysis>;
  listAnalyses(): Promise<TokenAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  async getAnalysis(contractAddress: string): Promise<TokenAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(tokenAnalyses)
      .where(eq(tokenAnalyses.contractAddress, contractAddress));
    return analysis;
  }

  async createAnalysis(insertAnalysis: InsertTokenAnalysis): Promise<TokenAnalysis> {
    const [analysis] = await db
      .insert(tokenAnalyses)
      .values({
        contractAddress: insertAnalysis.contractAddress,
        tokenName: insertAnalysis.tokenName || null,
        tokenSymbol: insertAnalysis.tokenSymbol || null,
        analysis: insertAnalysis.analysis,
        score: insertAnalysis.score,
        createdAt: insertAnalysis.createdAt,
      })
      .returning();
    return analysis;
  }

  async listAnalyses(): Promise<TokenAnalysis[]> {
    return db.select().from(tokenAnalyses);
  }
}

export const storage = new DatabaseStorage();