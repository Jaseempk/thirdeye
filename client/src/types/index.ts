// Token Types
export interface TokenInfo {
  name: string;
  price: string;
  symbol: string;
  marketCap: string;
  totalFees: string;
  volume24h: string;
  totalVolume: string;
}

export interface PoolStats {
  flipped: boolean;
  liquidity: string;
  volumeETH: string;
  totalFeesETH: string;
  fairLaunchedEnded: boolean;
}

export interface FairLaunch {
  active: boolean;
  endsAt: string;
  ethEarned: string;
  initialSupply: string;
  soldInitialSupply: string;
}

export interface FlaunchStats {
  averageRaised: number;
  potentialRugs: number;
  lastLaunchDate: string;
  firstLaunchDate: string;
  totalCollections: number;
  successfulLaunches: number;
}

export interface Deployer {
  address: string;
  fairLaunch: FairLaunch;
  flaunchStats: FlaunchStats;
  poolStats: PoolStats;
  tokenInfo: TokenInfo;
}

export interface HolderChange {
  change: number;
  changePercent: number;
}

export interface HolderSupply {
  supply: string;
  supplyPercent: number;
}

export interface HolderStatistics {
  holderChange: {
    "1h": HolderChange;
    "5min": HolderChange;
    "3d": HolderChange;
    "6h": HolderChange;
    "7d": HolderChange;
    "24h": HolderChange;
    "30d": HolderChange;
  };
  holderSupply: {
    top10: HolderSupply;
    top25: HolderSupply;
    top50: HolderSupply;
    top100: HolderSupply;
    top250: HolderSupply;
    top500: HolderSupply;
  };
  holdersByAcquisition: {
    swap: number;
    airdrop: number;
    transfer: number;
  };
  totalHolders: number;
}

export interface AIAnalysis {
  score: number;
  analysis: string;
  insights: string[];
}

export interface Analysis {
  aiAnalysis: AIAnalysis;
  contractVerified: boolean;
  deployer: Deployer;
  holderCount: number;
  holderStatistics: HolderStatistics;
  launchedOnFlaunch: boolean;
  liquidityScore: number;
  ownershipRatio: number;
  topHolders: Array<{
    address: string;
    addressLabel: string;
    balance: string;
    isContract: boolean;
    percentage: number;
  }>;
}

// Main TokenAnalyticsData interface that matches the API response
export interface TokenAnalyticsData {
  id: number;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  analysis: Analysis;
  score: number;
  createdAt: string;
  imageUrl: string;
}

/*
 */
