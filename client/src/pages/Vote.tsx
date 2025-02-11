import React from "react";
import { Trophy, Wallet, Lock, Crown, Sparkles, ChevronUp } from "lucide-react";

const demoToken = {
  name: "thirdeye",
  symbol: "TEYE",
  address: "0xRAD...AR99",
  imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
  votes: 4269,
  marketCap: "$4.2M",
  holders: 2800,
  liquidityLocked: true,
  description: "The governance token of the Rug Radar platform",
  price: "$0.42",
  volume24h: "$1.2M",
  priceChange24h: "+15.3%",
};

export const Vote: React.FC = () => {
  const [isVoting, setIsVoting] = React.useState(false);
  const [voteCount, setVoteCount] = React.useState(4269);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Coming Soon Animation */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E7692C]/20 to-[#EB88EF]/20 rounded-3xl animate-pulse"></div>
        <div className="relative bg-black/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-primary/20">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 mb-8">
            {/* Title and Description */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h2 className="font-carbonic text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-[#E7692C] to-[#EB88EF] text-transparent bg-clip-text">
                  Community Voting
                </h2>
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#E7692C] animate-bounce" />
              </div>
              <p className="font-suisse text-lg sm:text-xl text-gray-400 max-w-2xl">
                Vote for the most promising tokens and earn rewards through our
                innovative voting system
              </p>
            </div>

            {/* Coming Soon Card */}
            <div className="relative w-full lg:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E7692C] to-[#EB88EF] rounded-xl animate-pulse blur-xl opacity-50"></div>
              <div className="relative bg-black/60 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-primary/20">
                <h3 className="font-carbonic text-xl sm:text-2xl mb-2 text-white">
                  Coming Soon
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#EB88EF]" />
                  <span className="font-suisse">Season 1 Launching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Mechanics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-[#E7692C]/20 hover:border-[#E7692C]/40 transition-colors">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#E7692C] mb-4" />
              <h3 className="font-carbonic text-lg sm:text-xl mb-2">
                Daily Rewards
              </h3>
              <p className="font-suisse text-sm sm:text-base text-gray-400">
                Top voters receive daily airdrops of platform tokens
              </p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-primary/20 hover:border-primary/40 transition-colors">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-4" />
              <h3 className="font-carbonic text-lg sm:text-xl mb-2">
                Token Staking
              </h3>
              <p className="font-suisse text-sm sm:text-base text-gray-400">
                Stake TEYE tokens to unlock voting power multipliers
              </p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-[#EB88EF]/20 hover:border-[#EB88EF]/40 transition-colors sm:col-span-2 lg:col-span-1">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#EB88EF] mb-4" />
              <h3 className="font-carbonic text-lg sm:text-xl mb-2">
                Verified Voting
              </h3>
              <p className="font-suisse text-sm sm:text-base text-gray-400">
                Connect wallet & hold TEYE to participate
              </p>
            </div>
          </div>

          {/* Demo Token Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={demoToken.imageUrl}
                      alt={demoToken.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-carbonic text-xl sm:text-2xl">
                        {demoToken.name}
                      </h3>
                      <p className="text-gray-400 font-suisse">
                        ${demoToken.symbol}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 font-suisse text-sm sm:text-base max-w-lg">
                    {demoToken.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsVoting(true);
                    setTimeout(() => {
                      setVoteCount((prev) => prev + 1);
                      setIsVoting(false);
                    }, 1000);
                  }}
                  disabled={isVoting}
                  className={`flex flex-col items-center gap-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all ${
                    isVoting
                      ? "bg-primary/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#E7692C] to-[#EB88EF] hover:opacity-90"
                  }`}
                >
                  <ChevronUp
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isVoting ? "animate-bounce" : ""
                    }`}
                  />
                  <span className="font-carbonic text-lg sm:text-xl">
                    {voteCount}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-gray-400 font-suisse mb-1">
                    Price
                  </p>
                  <p className="font-carbonic text-base sm:text-lg">
                    {demoToken.price}
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-gray-400 font-suisse mb-1">
                    24h Volume
                  </p>
                  <p className="font-carbonic text-base sm:text-lg">
                    {demoToken.volume24h}
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-3 col-span-2 sm:col-span-1">
                  <p className="text-xs sm:text-sm text-gray-400 font-suisse mb-1">
                    24h Change
                  </p>
                  <p className="font-carbonic text-base sm:text-lg text-green-400">
                    {demoToken.priceChange24h}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-suisse text-gray-400">
                <p>Market Cap: {demoToken.marketCap}</p>
                <p>Holders: {demoToken.holders.toLocaleString()}</p>
                {demoToken.liquidityLocked && (
                  <p className="text-green-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" /> Liquidity Locked
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
