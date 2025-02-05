import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tokenAnalysisSchema = z.object({
  holderCount: z.number(),
  liquidityScore: z.number(),
  contractVerified: z.boolean()
});

export type TokenAnalysisData = z.infer<typeof tokenAnalysisSchema>;

export const tokenAnalyses = pgTable("token_analyses", {
  id: serial("id").primaryKey(),
  contractAddress: text("contract_address").notNull(),
  tokenName: text("token_name"),
  tokenSymbol: text("token_symbol"),
  analysis: jsonb("analysis").$type<TokenAnalysisData>().notNull(),
  score: integer("score").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertTokenAnalysisSchema = createInsertSchema(tokenAnalyses).omit({
  id: true
});

export type InsertTokenAnalysis = z.infer<typeof insertTokenAnalysisSchema>;
export type TokenAnalysis = typeof tokenAnalyses.$inferSelect;