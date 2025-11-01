'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendData } from '@/lib/types';

interface RevenueChartProps {
  trendsData?: TrendData[];
  isLoading?: boolean;
}

// Fallback data if no data is provided
const fallbackData = [
  { date: '300', profit: 10 },
  { date: '200', profit: 20 },
  { date: '300', profit: 15 },
  { date: '400', profit: 40 },
  { date: '500', profit: 90 },
  { date: '400', profit: 120 },
  { date: '500', profit: 250 },
];

export default function RevenueChart({
  trendsData,
  isLoading = false,
}: RevenueChartProps) {
  const data = trendsData || fallbackData;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Revenue Over Time
        </h3>
        <div className="h-[300px] bg-slate-700/30 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Revenue Over Time
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            cursor={{ stroke: '#60a5fa' }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#3b82f6"
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
