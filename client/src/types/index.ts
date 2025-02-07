// Token Types
export interface TokenInfo {
  name: string;
  symbol: string;
  contract: string;
  marketCap: string;
  age: string;
  holders: number;
  tweetCount: number;
  liquidityScore: number;
  contractVerified: boolean;
  launchedOnFlaunch: boolean;
  ownershipConcentration: number;
}

export interface DeployerInfo {
  address: string;
  totalCollections: number;
  successfulLaunches: number;
  successRate: number;
  firstLaunch: string;
}

export interface HolderDistribution {
  top10: number;
  top25: number;
  top50: number;
  top100: number;
}

export interface HolderChange {
  count: number;
  percentage: number;
}

export interface HolderChanges {
  last24h: HolderChange;
  last7d: HolderChange;
  last30d: HolderChange;
}

export interface TopHolder {
  address: string;
  percentage: number;
  value: string;
}

export interface DistributionData {
  title: string;
  value: number;
  color: string;
}

export interface TokenAnalyticsData {
  safetyScore: number;
  tokenInfo: TokenInfo;
  deployerInfo: DeployerInfo;
  holderDistribution: HolderDistribution;
  holderChanges: HolderChanges;
  topHolders: TopHolder[];
  distributionData: DistributionData[];
  aiAnalysis: string[];
}