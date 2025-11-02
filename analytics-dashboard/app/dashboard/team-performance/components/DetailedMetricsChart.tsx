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
import type { TeamPerformance } from '@/lib/types';

interface DetailedMetricsChartProps {
  teams: TeamPerformance[];
  isLoading: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f97316'];

export default function DetailedMetricsChart({
  teams,
  isLoading,
}: DetailedMetricsChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Detailed Metrics Comparison
        </h3>
        <div className="h-64 bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Detailed Metrics Comparison
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = teams.map((team) => ({
    name: team.team,
    'Avg Profit': Math.round((team.avgProfit || 0) / 100),
    'Payment Rate': Math.round(team.paymentRate || 0),
  }));

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 h-[25rem]">
      <h3 className="text-lg font-semibold text-white mb-6">
        Detailed Metrics Comparison
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar
            dataKey="Avg Profit"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="Payment Rate"
            fill="#f97316"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
