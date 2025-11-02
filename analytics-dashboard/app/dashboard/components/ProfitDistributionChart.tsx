'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ProfitDistribution } from '@/lib/types';

interface ProfitDistributionChartProps {
  data?: ProfitDistribution;
  isLoading?: boolean;
}

export default function ProfitDistributionChart({
  data,
  isLoading = false,
}: ProfitDistributionChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Profit Distribution
        </h3>
        <div className="h-[350px] bg-slate-700/30 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Profit Distribution
        </h3>
        <div className="flex items-center justify-center h-[350px]">
          <p className="text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data from percentiles
  const chartData = [
    {
      name: 'P10',
      value: data.percentiles?.p10 || 0,
      label: '10th %ile',
    },
    {
      name: 'P25',
      value: data.percentiles?.p25 || 0,
      label: '25th %ile (Q1)',
    },
    {
      name: 'P50',
      value: data.percentiles?.p50 || 0,
      label: '50th %ile (Median)',
    },
    {
      name: 'P75',
      value: data.percentiles?.p75 || 0,
      label: '75th %ile (Q3)',
    },
    {
      name: 'P90',
      value: data.percentiles?.p90 || 0,
      label: '90th %ile',
    },
    {
      name: 'P95',
      value: data.percentiles?.p95 || 0,
      label: '95th %ile',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Profit Distribution
      </h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            formatter={(value) => `$${(value as number).toLocaleString()}`}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Statistics Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Min</p>
          <p className="text-sm font-semibold text-white">
            ${(data.min || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Q1 (25%)</p>
          <p className="text-sm font-semibold text-blue-400">
            ${(data.quartiles?.q1 || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Median</p>
          <p className="text-sm font-semibold text-emerald-400">
            ${(data.median || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Q3 (75%)</p>
          <p className="text-sm font-semibold text-blue-400">
            ${(data.quartiles?.q3 || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Max</p>
          <p className="text-sm font-semibold text-white">
            ${(data.max || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Std Dev</p>
          <p className="text-sm font-semibold text-orange-400">
            ${(data.stdDev || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/30 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Mean Profit</p>
          <p className="text-lg font-semibold text-white">
            ${(data.mean || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Total Jobs</p>
          <p className="text-lg font-semibold text-white">
            {(data.totalJobs || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Total Profit</p>
          <p className="text-lg font-semibold text-emerald-400">
            ${(data.totalProfit || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Avg per Job</p>
          <p className="text-lg font-semibold text-blue-400">
            ${data.totalJobs && data.totalProfit ? (data.totalProfit / data.totalJobs).toLocaleString() : '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
