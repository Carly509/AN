'use client';

import { Building2, Users, TrendingUp } from 'lucide-react';
import type { TeamPerformance } from '@/lib/types';

interface TeamCardsProps {
  teams: TeamPerformance[];
  isLoading: boolean;
}

const teamColors = {
  'Tech Sales': { icon: 'bg-blue-500/20 text-blue-400', border: 'border-blue-500/30' },
  'Home Sales': { icon: 'bg-green-500/20 text-green-400', border: 'border-green-500/30' },
  'Auto Sales': { icon: 'bg-orange-500/20 text-orange-400', border: 'border-orange-500/30' },
  default: { icon: 'bg-purple-500/20 text-purple-400', border: 'border-purple-500/30' },
};

export default function TeamCards({ teams, isLoading }: TeamCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-slate-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => {
        const colors = (teamColors as any)[team.team] || teamColors.default;
        return (
          <div
            key={team.team}
            className={`border-l-4 rounded-lg p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-b border-r border-slate-700/50 ${colors.border}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{team.team}</h3>
              </div>
              <div className={`p-3 rounded-lg ${colors.icon}`}>
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Profit</p>
                <p className="text-2xl font-bold text-white">
                  ${(team.totalProfit / 1000000).toFixed(1)}M
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Jobs</p>
                  <p className="text-lg font-semibold text-blue-400">
                    {(team.jobCount || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Avg Profit</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    ${(team.avgProfit || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700/30 pt-3 mt-3">
                <p className="text-xs text-slate-400 mb-1">Payment Rate</p>
                <p className="text-lg font-semibold text-orange-400">
                  {((team.paymentRate || 0)).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
