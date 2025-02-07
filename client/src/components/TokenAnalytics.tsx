import React from 'react';
import { Twitter, ExternalLink, Search, AlertTriangle, Clock, Users, DollarSign, Copy } from 'lucide-react';
import { PieChart } from 'react-minimal-pie-chart';
import { useTokenAnalytics } from '../hooks/useTokenAnalytics';
import { TokenAnalyticsData } from '../types';
import { formatAddress, formatNumber, formatPercentage } from '../utils/formatters';

interface TokenAnalyticsProps {
  address: string;
  tokenData?: TokenAnalyticsData;
  onAnalyze: (address: string) => void;
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({ address, tokenData, onAnalyze }) => {
  const [searchAddress, setSearchAddress] = React.useState(address);
  const [hoveredSegment, setHoveredSegment] = React.useState<number | null>(null);
  const { isLoading, error } = useTokenAnalytics();

  if (!tokenData) {
    return (
      <div className="p-6">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter token address..."
              className="flex-1 bg-black/20 border border-primary/20 rounded-lg px-4 py-2 text-white font-suisse"
            />
            <button 
              onClick={() => onAnalyze(searchAddress)}
              disabled={isLoading}
              className="bg-primary px-6 py-2 rounded-lg font-suisse flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Analyze
            </button>
          </div>
          {error && (
            <div className="text-red-400 font-suisse text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Header */}
      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-carbonic text-3xl">{tokenData.tokenInfo.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400 font-suisse">${tokenData.tokenInfo.symbol}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(tokenData.tokenInfo.contract)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-carbonic bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              {formatPercentage(tokenData.safetyScore)}
            </div>
            <p className="text-sm text-gray-400 font-suisse">Safety Score</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats */}
        <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-suisse text-sm">Age</span>
              </div>
              <div className="font-carbonic text-lg">{tokenData.tokenInfo.age}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="font-suisse text-sm">Holders</span>
              </div>
              <div className="font-carbonic text-lg">{formatNumber(tokenData.tokenInfo.holders)}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-suisse text-sm">Market Cap</span>
              </div>
              <div className="font-carbonic text-lg">{tokenData.tokenInfo.marketCap}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Twitter className="w-4 h-4" />
                <span className="font-suisse text-sm">Tweets</span>
              </div>
              <div className="font-carbonic text-lg">{tokenData.tokenInfo.tweetCount}</div>
            </div>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
          <h3 className="font-carbonic text-xl mb-4">Holder Distribution</h3>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="font-carbonic text-2xl">
                  {hoveredSegment !== null 
                    ? formatPercentage(tokenData.distributionData[hoveredSegment].value)
                    : '100%'}
                </div>
                <div className="text-sm text-gray-400 font-suisse">
                  {hoveredSegment !== null 
                    ? tokenData.distributionData[hoveredSegment].title
                    : 'Total'}
                </div>
              </div>
            </div>
            <PieChart
              data={tokenData.distributionData}
              lineWidth={20}
              paddingAngle={2}
              animate
              onMouseOver={(_, index) => setHoveredSegment(index)}
              onMouseOut={() => setHoveredSegment(null)}
              segmentsStyle={{ transition: 'stroke-width 0.2s' }}
              segmentsShift={(index) => (hoveredSegment === index ? 3 : 0)}
              style={{ height: '300px' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {tokenData.distributionData.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2"
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-suisse text-sm">
                  {item.title}: {formatPercentage(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
          <h3 className="font-carbonic text-xl mb-4">AI Analysis</h3>
          <div className="space-y-4">
            {tokenData.aiAnalysis.map((analysis, index) => (
              <div key={index} className="flex items-start gap-2 bg-black/30 p-4 rounded-lg border border-primary/10">
                {analysis.toLowerCase().includes("warning") || analysis.toLowerCase().includes("risk") ? (
                  <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 text-green-400 mt-1 flex-shrink-0">✓</div>
                )}
                <p className="font-suisse text-sm text-gray-300">{analysis}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Holders Table */}
      <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm border border-primary/20">
        <h3 className="font-carbonic text-xl mb-4">Top Holders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-suisse text-sm text-gray-400">
                <th className="pb-4">Wallet</th>
                <th className="pb-4 text-right">Share</th>
                <th className="pb-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {tokenData.topHolders.map((holder, index) => (
                <tr key={index} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 font-suisse">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">{formatAddress(holder.address)}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(holder.address)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right font-carbonic">{formatPercentage(holder.percentage)}</td>
                  <td className="py-4 text-right font-carbonic">{holder.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <a
          href={`https://twitter.com/search?q=${tokenData.tokenInfo.symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors px-6 py-3 rounded-lg font-suisse flex items-center justify-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          View on Twitter
        </a>
        <a
          href="https://flaunch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-suisse flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Buy on Flaunch
        </a>
      </div>
    </div>
  );
};