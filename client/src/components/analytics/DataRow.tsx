import React from 'react';
import { Copy } from 'lucide-react';

interface DataRowProps {
  label: string;
  value: string | number | React.ReactNode;
  copyable?: boolean;
  copyValue?: string;
}

export const DataRow: React.FC<DataRowProps> = ({ label, value, copyable, copyValue }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between py-2 md:py-1">
    <span className="text-gray-400 font-suisse text-sm md:text-base">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-suisse text-sm md:text-base">{value}</span>
      {copyable && copyValue && (
        <button 
          onClick={() => navigator.clipboard.writeText(copyValue)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);