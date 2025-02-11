import React from "react";
import { Home } from "./pages/Home";
import { Analysis } from "./pages/Analysis";
import { Vote } from "./pages/Vote";
import { Terms } from "./pages/Terms";
import { Menu, X } from "lucide-react";

function App() {
  const [currentPage, setCurrentPage] = React.useState<
    "home" | "analysis" | "vote" | "terms"
  >("home");
  const [searchAddress, setSearchAddress] = React.useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleAnalyze = (address: string) => {
    if (address.trim()) {
      setSearchAddress(address);
      setCurrentPage("analysis");
    }
  };

  const handlePageChange = (page: typeof currentPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient-x"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-primary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <h1
                onClick={() => setCurrentPage("home")}
                className="text-4xl font-serif bg-gradient-to-r white bg-clip-text animate-pulse cursor-pointer hover:from-yellow-400 hover:to-amber-200 transition-all duration-300"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
              >
                thirdeye
              </h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => handlePageChange("home")}
                  className={`px-4 py-2 rounded-lg font-nohemi text-sm transition-colors ${
                    currentPage === "home"
                      ? "bg-gradient-to-r from-[#E7692C] to-[#EB88EF]"
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handlePageChange("vote")}
                  className={`px-4 py-2 rounded-lg font-nohemi text-sm transition-colors ${
                    currentPage === "vote"
                      ? "bg-gradient-to-r from-[#E7692C] to-[#EB88EF]"
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                >
                  Vote
                </button>
                <button
                  onClick={() => handlePageChange("terms")}
                  className={`px-4 py-2 rounded-lg font-nohemi text-sm transition-colors ${
                    currentPage === "terms"
                      ? "bg-gradient-to-r from-[#E7692C] to-[#EB88EF]"
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                >
                  Terms
                </button>
              </nav>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-primary/20 bg-black/95 backdrop-blur-lg">
              <div className="px-4 py-3 space-y-2">
                <button
                  onClick={() => handlePageChange("home")}
                  className={`w-full px-4 py-2 rounded-lg font-nohemi text-sm transition-colors ${
                    currentPage === "home"
                      ? "bg-gradient-to-r from-[#E7692C] to-[#EB88EF]"
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handlePageChange("vote")}
                  className={`w-full px-4 py-2 rounded-lg font-nohemi text-sm transition-colors ${
                    currentPage === "vote"
                      ? "bg-gradient-to-r from-[#E7692C] to-[#EB88EF]"
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                >
                  Vote
                </button>
                <button
                  onClick={() => handlePageChange("terms")}
                  className={`w-full px-4 py-2 rounded-lg font-nohemi text-sm transition-colors ${
                    currentPage === "terms"
                      ? "bg-gradient-to-r from-[#E7692C] to-[#EB88EF]"
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                >
                  Terms
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
          {currentPage === "home" ? (
            <Home onAnalyze={handleAnalyze} />
          ) : currentPage === "analysis" ? (
            <Analysis address={searchAddress} />
          ) : currentPage === "vote" ? (
            <Vote />
          ) : (
            <Terms />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

/**
 *           <h1
            onClick={() => setCurrentPage("home")}
            className="text-4xl font-serif bg-gradient-to-r white bg-clip-text animate-pulse cursor-pointer hover:from-yellow-400 hover:to-amber-200 transition-all duration-300"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
          >
            thirdeye
          </h1>
 */
