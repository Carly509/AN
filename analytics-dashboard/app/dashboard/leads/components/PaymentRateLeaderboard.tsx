'use client';

import { useState } from 'react';

interface PaymentCollectionProps {
  data: any[];
  isLoading: boolean;
}

export default function PaymentRateLeaderboard({
  data,
  isLoading,
}: PaymentCollectionProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'needs'>('top');

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-8 mt-8">
        <div className="h-96 bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No payment data available</p>
      </div>
    );
  }

  const sortedByPaymentRate = [...data].sort((a, b) => (b.paymentRate || 0) - (a.paymentRate || 0));

  const itemsPerSection = 4;
  const topPerformers = sortedByPaymentRate.slice(0, itemsPerSection);
  const needsAttention = sortedByPaymentRate.slice(-itemsPerSection).reverse();

  const displayData = activeTab === 'top' ? topPerformers : needsAttention;

  const getPaymentRateColor = (rate: number) => {
    if (rate >= 90) return '#10b981';
    if (rate >= 80) return '#3b82f6';
    if (rate >= 70) return '#fbbf24';
    return '#ef4444';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-8 mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
        Agent Payment Rate Leaderboard
      </h2>

      <div className="flex gap-2 md:gap-3 mb-8 flex-wrap md:flex-nowrap">
        <button
          onClick={() => setActiveTab('top')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            activeTab === 'top'
              ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300'
              : 'bg-slate-800/30 border border-slate-700 text-slate-400 hover:text-slate-300'
          }`}
        >
          Top Performers
        </button>
        <button
          onClick={() => setActiveTab('needs')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            activeTab === 'needs'
              ? 'bg-slate-700/50 border border-slate-600 text-slate-300'
              : 'bg-slate-800/30 border border-slate-700 text-slate-400 hover:text-slate-300'
          }`}
        >
          Needs Attention
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-2 md:px-4 py-3 md:py-4 text-xs font-semibold text-slate-400 uppercase">Rank</th>
              <th className="text-left px-2 md:px-4 py-3 md:py-4 text-xs font-semibold text-slate-400 uppercase">Agent</th>
              <th className="text-left px-2 md:px-4 py-3 md:py-4 text-xs font-semibold text-slate-400 uppercase hidden sm:table-cell">Team</th>
              <th className="text-left px-2 md:px-4 py-3 md:py-4 text-xs font-semibold text-slate-400 uppercase">Rate</th>
              <th className="text-left px-2 md:px-4 py-3 md:py-4 text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Paid</th>
              <th className="text-left px-2 md:px-4 py-3 md:py-4 text-xs font-semibold text-slate-400 uppercase hidden lg:table-cell">Unpaid</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((agent, index) => {
                const paymentRateColor = getPaymentRateColor(agent.paymentRate || 0);
                const rankIcon = getRankIcon(index);

                return (
                  <tr
                    key={agent.agent}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition text-xs md:text-sm"
                  >
                    <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                      <div className="w-6 md:w-8 h-6 md:h-8 flex items-center justify-center text-base md:text-lg font-bold">
                        {typeof rankIcon === 'string' ? rankIcon : rankIcon}
                      </div>
                    </td>

                    <td className="px-2 md:px-4 py-3 md:py-4">
                      <p className="font-medium text-white truncate">{agent.agent}</p>
                    </td>

                    <td className="px-2 md:px-4 py-3 md:py-4 hidden sm:table-cell">
                      <p className="text-slate-400">{agent.team}</p>
                    </td>

                    <td className="px-2 md:px-4 py-3 md:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 md:w-24 h-2 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${agent.paymentRate || 0}%`,
                              backgroundColor: paymentRateColor,
                            }}
                          ></div>
                        </div>
                        <span
                          className="text-xs md:text-sm font-semibold"
                          style={{ color: paymentRateColor }}
                        >
                          {(agent.paymentRate || 0).toFixed(0)}%
                        </span>
                      </div>
                    </td>

                    <td className="px-2 md:px-4 py-3 md:py-4 hidden md:table-cell">
                      <p className="text-emerald-400 font-semibold text-xs md:text-sm">
                        ${(agent.paidProfit / 1000).toFixed(0)}k
                      </p>
                    </td>

                    <td className="px-2 md:px-4 py-3 md:py-4 hidden lg:table-cell">
                      <p className="text-red-400 font-semibold text-xs md:text-sm">
                        ${(agent.unpaidProfit / 1000).toFixed(0)}k
                      </p>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-2 md:px-4 py-8 text-center text-slate-400">
                  No agents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
