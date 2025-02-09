import React from 'react';
import { Copy } from 'lucide-react';
import { TokenInfo } from '../../types';

interface TokenHeaderProps {
  name: string;
  symbol: string;
  safetyScore: number;
  address: string;
}

export const TokenHeader: React.FC<TokenHeaderProps> = ({
  name,
  symbol,
  safetyScore,
  address,
}) => (
  <div className="bg-black/20 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-primary/20">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
      <div>
        <h2 className="font-carbonic text-2xl md:text-3xl">{name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-400 font-suisse">${symbol}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(address)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-left md:text-right">
        <div className="text-3xl md:text-4xl font-carbonic bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          {safetyScore}%
        </div>
        <p className="text-sm text-gray-400 font-suisse">Safety Score</p>
      </div>
    </div>
  </div>
);