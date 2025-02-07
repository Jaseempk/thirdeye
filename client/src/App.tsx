import React from 'react';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { Vote } from './pages/Vote';

function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'analysis' | 'vote'>('home');
  const [searchAddress, setSearchAddress] = React.useState<string>('');

  const handleAnalyze = (address: string) => {
    if (address.trim()) {
      setSearchAddress(address);
      setCurrentPage('analysis');
    }
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
        <header className="flex items-center justify-between py-6 px-8 backdrop-blur-lg border-b border-primary/20">
          <h1 
            onClick={() => setCurrentPage('home')}
            className="font-carbonic text-4xl bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text animate-pulse cursor-pointer"
          >
            Rug Radar
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              {/* <input
                type="text"
                placeholder="Enter token address..."
                className="bg-black/40 border border-primary/20 rounded-lg px-4 py-2 text-white font-suisse w-96 pr-24"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnalyze((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button 
                onClick={() => handleAnalyze((document.querySelector('input') as HTMLInputElement).value)}
                className="absolute right-2 top-1 bg-gradient-to-r from-[#E7692C] to-[#EB88EF] px-4 py-1 rounded-lg font-carbonic hover:opacity-90 transition-opacity"
              >
                Analyze
              </button> */}
            </div>
            <nav className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-6 py-2 rounded-lg font-carbonic transition-colors ${
                  currentPage === 'home' 
                    ? 'bg-gradient-to-r from-[#E7692C] to-[#EB88EF]' 
                    : 'bg-black/40 hover:bg-black/60'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('vote')}
                className={`px-6 py-2 rounded-lg font-carbonic transition-colors ${
                  currentPage === 'vote' 
                    ? 'bg-gradient-to-r from-[#E7692C] to-[#EB88EF]' 
                    : 'bg-black/40 hover:bg-black/60'
                }`}
              >
                Vote
              </button>
            </nav>
          </div>
        </header>

        <main>
          {currentPage === 'home' ? (
            <Home onAnalyze={handleAnalyze} />
          ) : currentPage === 'analysis' ? (
            <Analysis address={searchAddress} />
          ) : (
            <Vote />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;