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
    totalCollections: number;
    successfulLaunches: number;
    potentialRugs: number;
    averageRaised: number;
    firstLaunchDate?: string;
    lastLaunchDate?: string;
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
    totalSupply: string;
    totalVolume: string;
    totalHolders: number;
  };
}

export interface AIAnalysis {
  score: number;
  insights: string[];
  analysis: string;
}

export interface TokenMetadata {
  logoUrl: string | null;
  name: string;
  symbol: string;
  social: {
    telegram: string | null;
    twitter: string | null;
    website: string | null;
    discord: string | null;
  };
  description: string | null;
  creator: {
    id: string;
    ownedNFTs: Array<{
      id: string;
      name: string;
      symbol: string;
      tokenID: string;
    }>;
  };
  marketCapETH: string;
  poolStats: {
    fairLaunchedEnded: boolean;
    liquidity: string;
    volumeETH: string;
  };
  createdAt: string;
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
  metadata: TokenMetadata;
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
