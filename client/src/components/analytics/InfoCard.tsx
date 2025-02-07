import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-black/20 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-primary/20">
    <h3 className="font-carbonic text-xl mb-4 flex items-center gap-2 text-cyan-300">
      <Icon className="w-5 h-5" />
      {title}
    </h3>
    {children}
  </div>
);