import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const holderChangeSchema = z.object({
  change: z.number(),
  changePercent: z.number(),
});

export const holderSupplySchema = z.object({
  supply: z.string(),
  supplyPercent: z.number(),
});

export const holderStatisticsSchema = z.object({
  totalHolders: z.number(),
  holdersByAcquisition: z.object({
    swap: z.number(),
    transfer: z.number(),
    airdrop: z.number(),
  }),
  holderChange: z.object({
    "5min": holderChangeSchema,
    "1h": holderChangeSchema,
    "6h": holderChangeSchema,
    "24h": holderChangeSchema,
    "3d": holderChangeSchema,
    "7d": holderChangeSchema,
    "30d": holderChangeSchema,
  }),
  holderSupply: z.object({
    top10: holderSupplySchema,
    top25: holderSupplySchema,
    top50: holderSupplySchema,
    top100: holderSupplySchema,
    top250: holderSupplySchema,
    top500: holderSupplySchema,
  }),
});

export const holderSchema = z.object({
  address: z.string(),
  balance: z.string(),
  percentage: z.number(),
  isContract: z.boolean().optional(),
  addressLabel: z.string().nullable().optional(),
});

export const deployerSchema = z.object({
  address: z.string(),
  flaunchStats: z
    .object({
      totalCollections: z.number(),
      successfulLaunches: z.number(),
      potentialRugs: z.number(),
      averageRaised: z.number(),
      firstLaunchDate: z.string().optional(),
      lastLaunchDate: z.string().optional(),
    })
    .optional(),
});

export const aiInsightSchema = z.object({
  score: z.number(),
  insights: z.array(z.string()),
  analysis: z.string(),
});

export const tokenMetadataSchema = z.object({
  logoUrl: z.string().nullable(),
  name: z.string(),
  symbol: z.string(),
  social: z.object({
    telegram: z.string().nullable(),
    twitter: z.string().nullable(),
    website: z.string().nullable(),
    discord: z.string().nullable(),
  }),
  description: z.string().nullable(),
  creator: z.object({
    id: z.string(),
    ownedNFTs: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        symbol: z.string(),
        tokenID: z.string(),
      })
    ),
  }),
  marketCapETH: z.string(),
  poolStats: z.object({
    fairLaunchedEnded: z.boolean(),
    liquidity: z.string(),
    volumeETH: z.string(),
  }),
  createdAt: z.string(),
});

export interface Analysis {
  aiAnalysis?: {
    score: number;
    insights: string[];
    analysis: string;
  };
}

export const tokenAnalysisSchema = z.object({
  holderCount: z.number(),
  liquidityScore: z.number(),
  contractVerified: z.boolean(),
  topHolders: z.array(holderSchema),
  ownershipRatio: z.number(),
  deployer: deployerSchema,
  launchedOnFlaunch: z.boolean(),
  holderStatistics: holderStatisticsSchema,
  aiAnalysis: aiInsightSchema.optional(), // Make sure it's optional here
  metadata: tokenMetadataSchema,
});

export type TokenAnalysisData = z.infer<typeof tokenAnalysisSchema>;

export type Holder = z.infer<typeof holderSchema>;
export type Deployer = z.infer<typeof deployerSchema>;

export const tokenAnalyses = pgTable("token_analyses", {
  id: serial("id").primaryKey(),
  contractAddress: text("contract_address").notNull(),
  tokenName: text("token_name"),
  tokenSymbol: text("token_symbol"),
  analysis: jsonb("analysis").$type<TokenAnalysisData>().notNull(),
  score: integer("score").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertTokenAnalysisSchema = createInsertSchema(tokenAnalyses).omit(
  {
    id: true,
    analysis: true,
    score: true,
  }
);

export type InsertTokenAnalysis = z.infer<typeof insertTokenAnalysisSchema>;
export type TokenAnalysis = typeof tokenAnalyses.$inferSelect;
