'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  isLoading = false,
}: StatCardProps) {
  const changeColor = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-blue-400',
  };

  const changePrefix = {
    positive: '+',
    negative: '',
    neutral: '',
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-20 mb-4"></div>
        <div className="h-8 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600/50 transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        {Icon && (
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <Icon className="w-4 h-4 text-slate-300" />
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>

      {change && (
        <p className={`text-xs font-medium ${changeColor[changeType]}`}>
          {changePrefix[changeType]}
          {change}
        </p>
      )}
    </div>
  );
}
