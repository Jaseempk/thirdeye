import React, { useState } from "react";
import {
  ThumbsUp,
  ExternalLink,
  Copy,
  Shield,
  TrendingUp,
  Users,
  Lock,
} from "lucide-react";

interface TokenCardProps {
  name: string;
  address: string;
  imageUrl: string;
  votes: number;
  launchpadUrl: string;
  riskScore: number;
  marketCap: string;
  holders: number;
  liquidityLocked: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  name,
  address,
  imageUrl,
  votes,
  launchpadUrl,
  riskScore,
  marketCap,
  holders,
  liquidityLocked,
}) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const handleVote = () => {
    if (!hasVoted) {
      setLocalVotes((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-400";
    if (score < 70) return "text-warning";
    return "text-red-400";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-gradient-x"></div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-carbonic text-2xl text-white">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`flex items-center gap-1 ${getRiskColor(
                  riskScore
                )} text-sm font-suisse`}
              >
                <Shield className="w-4 h-4" />
                Risk Score: {riskScore}%
              </span>
              {liquidityLocked && (
                <span className="flex items-center gap-1 text-green-400 text-sm font-suisse">
                  <Lock className="w-4 h-4" />
                  Liquidity Locked
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleVote}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              hasVoted
                ? "bg-primary/40 cursor-not-allowed"
                : "bg-primary/20 hover:bg-primary/30"
            }`}
            disabled={hasVoted}
          >
            <ThumbsUp
              className={`w-4 h-4 ${hasVoted ? "text-primary" : "text-white"}`}
            />
            <span className="font-suisse">{localVotes}</span>
          </button>
        </div>

        <div className="mb-6">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover rounded-lg animate-float"
          />
        </div>

        {/* Token metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-sm text-gray-400 font-suisse mb-1">
              Market Cap
            </div>
            <div className="flex items-center gap-2 font-suisse">
              <TrendingUp className="w-4 h-4 text-accent" />
              {marketCap}
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-sm text-gray-400 font-suisse mb-1">
              Holders
            </div>
            <div className="flex items-center gap-2 font-suisse">
              <Users className="w-4 h-4 text-accent" />
              {holders.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Address and actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 bg-black/20 p-3 rounded-lg">
            <span className="font-suisse text-sm text-gray-300 truncate">
              {address}
            </span>
            <button
              onClick={copyAddress}
              className="p-1.5 hover:bg-primary/20 rounded-md transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <a
            href={launchpadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-accent py-3 px-4 rounded-lg font-suisse hover:opacity-90 transition-opacity"
          >
            Buy Token <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
