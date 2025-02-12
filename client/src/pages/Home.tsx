import React from "react";
import {
  Rocket,
  Shield,
  Search,
  // Zap,
  ExternalLink,
  Twitter,
  // Flame,
  // TrendingUp,
  // DollarSign,
  Sparkles,
  Siren,
  Bot,
  Crown,
  AlertTriangle,
  // MessageCircle,
} from "lucide-react";
import { TokenCard } from "../components/TokenCard";
import { ConnectButton } from "../components/ConnectButton";
import { useAccount } from "wagmi";

interface HomeProps {
  onAnalyze: (address: string) => void;
}

const tokenOfTheDay = {
  name: "$TEYE",
  address: "2PHi2f7xPq6bnh2J6xRN2Qc5TJ37epHihvBk49DgpAaU",
  imageUrl:
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832",
  votes: 1337,
  launchpadUrl: "https://flaunch.gg",
  riskScore: 59.48,
  marketCap: "$1.2M",
  holders: 2800,
  liquidityLocked: true,
};

export const Home: React.FC<HomeProps> = ({ onAnalyze }) => {
  const [tokenAddress, setTokenAddress] = React.useState("");
  const { isConnected } = useAccount();
  const [showAlert, setShowAlert] = React.useState(true);

  return (
    <div className="min-h-screen">
      {/* Live Rug Alert Banner */}
      {showAlert && (
        <div className="fixed top-20 left-0 right-0 z-50 mx-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/20 backdrop-blur-lg rounded-lg p-4 border border-red-500/40 shadow-lg animate-pulse">
              <div className="flex items-center justify-between">

                <div className="flex justify-center items-center gap-3">
                  <Siren className="w-6 h-6 text-red-500 animate-bounce" />
                  <div>
                    <p className="font-carbonic text-red-500 ">
                      We only support flaunch and flaunched coins
                    </p>
                    {/* <p className="text-sm text-gray-300">Flaunch ftw</p> */}
                  </div>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-gradient-x"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-suisse text-green-400">
              420+ Rugs Prevented This Week
            </span>
          </div>
          <h1 className="font-carbonic text-7xl mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">
              Detect Rugs Before
            </span>
            <br />
            <span className="text-white">They Pull The Floor</span>
          </h1>
          <p className="font-suisse text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Advanced token analytics platform powered by AI to help you make
            non-retarded decisions in the trenches
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            {!isConnected ? (
              <div className="flex flex-col items-center gap-4">
                <ConnectButton />
                <p className="text-gray-400 font-suisse text-sm">
                  Connect your wallet to start analyzing tokens
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address..."
                    className="w-full bg-black/40 border border-primary/20 rounded-lg px-4 py-3 md:py-4 text-white font-suisse pr-24 md:pr-36 text-sm md:text-base"
                  />
                  <button
                    onClick={() => onAnalyze(tokenAddress)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#E7692C] to-[#EB88EF] px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-nohemi text-base md:text-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Analyze</span>
                  </button>
                </div>
                <p className="text-xs md:text-sm text-gray-400 font-suisse">
                  Disclaimer: The model is in beta and actively being trained.
                  This is not a financial advice, see more at{" "}
                  <button
                    onClick={() => (window.location.hash = "#/terms")}
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    Terms and Conditions
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Degen Stats Section */}
      {isConnected && (
        <section className="container mx-auto px-4 mb-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trending Tokens
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-green-500" />
              <h3 className="font-carbonic text-xl">🔥 Trending Now</h3>
            </div>
            <div className="space-y-3">
              {trendingTokens.map((token, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                >
                  <span className="font-suisse">${token.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-carbonic">
                      {token.gain}
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          {/* Recent Rugs */}
          {/* <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Siren className="w-6 h-6 text-red-500" />
              <h3 className="font-carbonic text-xl">⚠️ Recent Rugs</h3>
            </div>
            <div className="space-y-3">
              {rugAlerts.map((rug, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                >
                  <div>
                    <span className="font-suisse">${rug.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {rug.time}
                    </span>
                  </div>
                  <span className="text-red-400 font-carbonic">{rug.loss}</span>
                </div>
              ))}
            </div>
          </div> */}
        </section>
      )}

      {/* Token of the Day */}
      {isConnected && (
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-suisse">
                Most Based Token Today
              </span>
            </div>
            <h2 className="font-carbonic text-4xl mb-4">Ticker of the Day</h2>
            <p className="font-suisse text-gray-400">
              Most voted token by our based community
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <TokenCard {...tokenOfTheDay} />
          </div>
        </section>
      )}

      {/* Features */}
      <section id="features" className="container mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2 className="font-carbonic text-4xl mb-4">Why Choose thirdeye</h2>
          <p className="font-suisse text-gray-400">
            Stay ahead of the game with our advanced features
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/20 backdrop-blur-sm border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-carbonic text-xl mb-2">Risk Analysis</h3>
            <p className="font-suisse text-gray-400">
              Advanced AI-powered risk scoring system to detect potential rugs
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-secondary/20 rounded-xl p-6 hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-carbonic text-xl mb-2">AI Twitter Agent</h3>
            <p className="font-suisse text-gray-400">
              Get instant token analysis by tagging our AI agent in your tweets
              or tweet replies when you see KOL shills random shitter
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-accent/20 rounded-xl p-6 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-carbonic text-xl mb-2">Community Voting</h3>
            <p className="font-suisse text-gray-400">
              Vote for the best tokens and earn rewards through airdrops
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-warning/20 rounded-xl p-6 hover:border-warning/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-carbonic text-xl mb-2">Rug Alerts</h3>
            <p className="font-suisse text-gray-400">
              Real-time notifications when suspicious activity is detected
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 sm:p-12 backdrop-blur-sm border border-primary/20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full mb-6">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-suisse">
                Join 100k+ Degen Traders
              </span>
            </div>
            <h2 className="font-carbonic text-3xl sm:text-4xl mb-4">
              Ready to DYOR Like a Pro?
            </h2>
            <p className="font-suisse text-lg sm:text-xl text-gray-400 mb-8">
              Don't let the rugs pull you down. Start analyzing tokens now.
            </p>
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <button
                onClick={() => onAnalyze("")}
                className="bg-gradient-to-r from-[#E7692C] to-[#EB88EF] px-8 py-4 rounded-lg font-carbonic text-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                Start Analyzing <ExternalLink className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-primary/20">
        <div className="flex flex-col items-center justify-center gap-4">
          <img src="images/flaunch.png" alt="Flaunch Logo" className="w-20" />
          <p className="text-center font-suisse text-sm text-gray-400">
            powered by{" "}
            <a
              href="https://flaunch.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              flaunch
            </a>
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com/third9y9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://t.me/+YKM7szAwA2Q1OTk1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <img
                src="images/tg.png"
                alt="tg-logo"
                className="w-6 h-6 text-gray-400 hover:text-primary transition-colors"
              ></img>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
