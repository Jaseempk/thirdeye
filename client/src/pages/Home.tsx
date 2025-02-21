import React from "react";
import {
  Rocket,
  Shield,
  Search,
  ExternalLink,
  Twitter,
  // Sparkles,
  Siren,
  Bot,
  Crown,
  // AlertTriangle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { TokenCard } from "../components/TokenCard";

import { useAccount } from "wagmi";

interface HomeProps {
  onAnalyze: (address: string) => void;
  onNavigate?: (page: "home" | "analysis" | "vote" | "terms") => void;
}

const tokenOfTheDay = {
  name: "$SOON",
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

const roadmapItems = [
  {
    title: "Token Analysis",
    description:
      "Advanced AI-powered token analysis with comprehensive risk assessment and holder analytics",
    status: "completed",
    icon: Shield,
  },
  {
    title: "Twitter AI Agent",
    description:
      "Get instant token analysis by tagging our AI agent in your tweets when you see KOL shills",
    status: "upcoming",
    icon: Bot,
    eta: "Q1 2025",
  },
  {
    title: "Flaunch Integration",
    description:
      "Daily scanning of Flaunch to identify and rank the most promising new tokens",
    status: "upcoming",
    icon: Rocket,
    eta: "Q1 2025",
  },
  {
    title: "Community Governance",
    description:
      "Decentralized decision-making for feature prioritization and platform development",
    status: "planned",
    icon: Crown,
    eta: "Q2 2025",
  },
];

export const Home: React.FC<HomeProps> = ({ onAnalyze, onNavigate }) => {
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
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-suisse text-green-400">
              420+ Rugs Prevented This Week
            </span>
          </div> */}
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
                  onClick={() => onNavigate?.("terms")}
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  Terms and Conditions
                </button>
              </p>
            </div>
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
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-suisse">Most Based Token Today</span>
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

      {/* Roadmap Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 mb-12 md:mb-20">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary/20 rounded-full mb-4">
            <Rocket className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-suisse">
              Project Roadmap
            </span>
          </div>
          <h2 className="font-carbonic text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">
            Building The Future
          </h2>
          <p className="font-suisse text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Our mission to make trenches safer, one token at a time
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"></div>

          <div className="space-y-6 md:space-y-12 lg:space-y-0">
            {roadmapItems.map((item, index) => (
              <div
                key={item.title}
                className={`relative flex flex-col lg:flex-row gap-6 lg:gap-12 ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : ""}`}
                >
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                    <div
                      className={`flex items-center gap-3 mb-3 md:mb-4 ${
                        index % 2 === 0 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-carbonic text-lg md:text-xl lg:text-2xl">
                        {item.title}
                      </h3>
                    </div>
                    <p className="font-suisse text-sm md:text-base text-gray-400 mb-4">
                      {item.description}
                    </p>
                    <div
                      className={`flex items-center gap-2 ${
                        index % 2 === 0 ? "lg:justify-end" : ""
                      }`}
                    >
                      {item.status === "completed" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-xs md:text-sm font-suisse">
                            Completed
                          </span>
                        </>
                      ) : item.status === "upcoming" ? (
                        <>
                          <CircleDot className="w-4 h-4 text-primary animate-pulse" />
                          <span className="text-primary text-xs md:text-sm font-suisse">
                            Coming {item.eta}
                          </span>
                        </>
                      ) : (
                        <>
                          <CircleDot className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-xs md:text-sm font-suisse">
                            Planned for {item.eta}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline dot for desktop */}
                <div className="hidden lg:flex items-center justify-center w-12">
                  <div className="relative">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-400"
                          : item.status === "upcoming"
                          ? "bg-primary animate-pulse"
                          : "bg-gray-400"
                      }`}
                    >
                      <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-inherit"></div>
                    </div>
                  </div>
                </div>

                {/* Empty div for layout */}
                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
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

            <button
              onClick={() => onAnalyze("")}
              className="bg-gradient-to-r from-[#E7692C] to-[#EB88EF] px-8 py-4 rounded-lg font-carbonic text-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Start Analyzing <ExternalLink className="w-5 h-5" />
            </button>
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
