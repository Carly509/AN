'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LeadSourceROIProps {
  data: any[];
  isLoading: boolean;
}

export default function LeadSourceROI({ data, isLoading }: LeadSourceROIProps) {
  const [sortBy, setSortBy] = useState('roi');

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-8">
        <div className="h-96 bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No lead data available</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'roi') {
      return (b.roi || 0) - (a.roi || 0);
    } else if (sortBy === 'volume') {
      return (b.jobCount || 0) - (a.jobCount || 0);
    } else if (sortBy === 'profit') {
      return (b.totalProfit || 0) - (a.totalProfit || 0);
    } else {
      return (b.paymentRate || 0) - (a.paymentRate || 0);
    }
  });

  const getRoiColor = (roiValue: number) => {
    if (roiValue >= 40) return '#10b981';
    if (roiValue >= 30) return '#fbbf24';
    return '#ef4444';
  };

  const getPaymentPercentages = (item: any) => {
    const paidPercentage = item.jobCount > 0 ? (item.paidJobs / item.jobCount) * 100 : 0;
    const unpaidPercentage = 100 - paidPercentage;
    return { paidPercentage, unpaidPercentage };
  };

  const getGridColumns = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'sm:grid-cols-2';
    if (count === 3) return 'sm:grid-cols-2 lg:grid-cols-3';
    if (count >= 4) return 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    return 'sm:grid-cols-2';
  };

  const gridClass = getGridColumns(sortedData.length);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white">Lead Source ROI</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortBy('roi')}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap ${
              sortBy === 'roi'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Sort by: ROI
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSortBy('volume')}
            className={`px-2 py-2 rounded-lg font-medium transition text-xs sm:text-sm whitespace-nowrap ${
              sortBy === 'volume'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Lead Volume
          </button>
          <button
            onClick={() => setSortBy('profit')}
            className={`px-2 py-2 rounded-lg font-medium transition text-xs sm:text-sm whitespace-nowrap ${
              sortBy === 'profit'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Total Profit
          </button>
          <button
            onClick={() => setSortBy('conversion')}
            className={`px-2 py-2 rounded-lg font-medium transition text-xs sm:text-sm whitespace-nowrap ${
              sortBy === 'conversion'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Conversion
          </button>
        </div>
      </div>

      <div className={`grid ${gridClass} gap-4 md:gap-8`}>
        {sortedData.map((source) => {
          const roiColor = getRoiColor(source.roi || 0);
          const { paidPercentage, unpaidPercentage } = getPaymentPercentages(source);
          const paidColor = paidPercentage > 60 ? '#10b981' : paidPercentage > 40 ? '#fbbf24' : '#ef4444';

          return (
            <div key={source.leadSource} className="border border-slate-700/30 rounded-lg p-4 md:p-8">
              <h3 className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6">{source.leadSource}</h3>

              <div className="mb-6 md:mb-8">
                <div className="text-4xl md:text-5xl font-bold mb-4 md:mb-6" style={{ color: roiColor }}>
                  {(source.roi || 0).toFixed(0)}%
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                  <span className="text-slate-400 text-xs md:text-sm">Paid</span>
                  <span className="text-slate-400 text-xs md:text-sm">Unpaid</span>
                </div>

                <div className="flex gap-2 mb-2 md:mb-3 h-2">
                  <div
                    className="rounded-full"
                    style={{
                      width: `${paidPercentage}%`,
                      height: '8px',
                      backgroundColor: paidColor,
                      flexShrink: 0,
                    }}
                  ></div>
                  <div
                    className="bg-slate-700 rounded-full"
                    style={{
                      width: `${unpaidPercentage}%`,
                      height: '8px',
                    }}
                  ></div>
                </div>

                <p className="text-slate-400 text-xs md:text-sm">
                  {paidPercentage.toFixed(0)}% Paid / {unpaidPercentage.toFixed(0)}% Unpaid
                </p>
              </div>

              <div className="border-t border-slate-700/30 mb-4 md:mb-6"></div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm mb-1">Total Leads</p>
                  <p className="text-lg md:text-2xl font-semibold text-white">
                    {source.jobCount}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs md:text-sm mb-1">Total Profit</p>
                  <p className="text-lg md:text-2xl font-semibold text-white">
                    ${(source.totalProfit / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
