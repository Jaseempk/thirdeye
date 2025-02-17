// Basic type definitions
export interface HolderChange {
  change: number;
  changePercent: number;
}

export interface HolderSupply {
  supply: string;
  supplyPercent: number;
}

export interface HolderStatistics {
  totalHolders: number;
  holdersByAcquisition: {
    swap: number;
    transfer: number;
    airdrop: number;
  };
  holderChange: {
    "5min": HolderChange;
    "1h": HolderChange;
    "6h": HolderChange;
    "24h": HolderChange;
    "3d": HolderChange;
    "7d": HolderChange;
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
}

export interface Holder {
  address: string;
  balance: string;
  percentage: number;
  isContract?: boolean;
  addressLabel?: string | null;
}

export interface Deployer {
  address: string;
  flaunchStats?: {
    averageRaised: number;
    firstLaunchDate?: string;
    lastLaunchDate?: string;
    potentialRugs: number;
    successfulLaunches: number;
    totalCollections: number;
  };
  poolStats?: {
    fairLaunchedEnded: boolean;
    flipped: boolean;
    liquidity: string;
    totalFeesETH: string;
    volumeETH: string;
  };
  fairLaunch?: {
    active: boolean;
    endsAt: string;
    ethEarned: string;
    initialSupply: string;
    soldInitialSupply: string;
  };
  tokenInfo?: {
    name: string;
    price: string;
    symbol: string;
    marketCap: string;
    totalFees: string;
    volume24h: string;
    totalVolume: string;
    totalHolders: number;
  };
}

export interface AIAnalysis {
  score: number;
  insights: string[];
  analysis: string;
}

export interface TokenAnalysisData {
  holderCount: number;
  liquidityScore: number;
  contractVerified: boolean;
  topHolders: Holder[];
  ownershipRatio: number;
  deployer: Deployer;
  launchedOnFlaunch: boolean;
  holderStatistics: HolderStatistics;
  aiAnalysis?: AIAnalysis;
}

export interface TokenAnalysis {
  id: number;
  contractAddress: string;
  tokenName: string | null;
  tokenSymbol: string | null;
  analysis: TokenAnalysisData;
  score: number;
  createdAt: string;
}

export interface InsertTokenAnalysis {
  contractAddress: string;
  tokenName?: string | null;
  tokenSymbol?: string | null;
  createdAt: string;
}
