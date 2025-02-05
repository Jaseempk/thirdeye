import { tokenAnalyses, type TokenAnalysis, type InsertTokenAnalysis } from "@shared/schema";

export interface IStorage {
  getAnalysis(contractAddress: string): Promise<TokenAnalysis | undefined>;
  createAnalysis(analysis: InsertTokenAnalysis): Promise<TokenAnalysis>;
  listAnalyses(): Promise<TokenAnalysis[]>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, TokenAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async getAnalysis(contractAddress: string): Promise<TokenAnalysis | undefined> {
    return Array.from(this.analyses.values()).find(
      (analysis) => analysis.contractAddress === contractAddress
    );
  }

  async createAnalysis(insertAnalysis: InsertTokenAnalysis): Promise<TokenAnalysis> {
    const id = this.currentId++;
    const analysis: TokenAnalysis = { ...insertAnalysis, id };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async listAnalyses(): Promise<TokenAnalysis[]> {
    return Array.from(this.analyses.values());
  }
}

export const storage = new MemStorage();
