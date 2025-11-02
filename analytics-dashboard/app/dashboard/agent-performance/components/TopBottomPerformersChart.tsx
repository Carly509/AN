'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface TopBottomPerformersChartProps {
  topPerformers: any[];
  bottomPerformers: any[];
  isLoading: boolean;
}

export default function TopBottomPerformersChart({
  topPerformers,
  bottomPerformers,
  isLoading,
}: TopBottomPerformersChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-8 mb-8">
        <div className="h-96 bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!topPerformers || !bottomPerformers) {
    return null;
  }

  const top3 = topPerformers.slice(0, 3);
  const bottom3 = bottomPerformers.slice(0, 3);

  const chartData = [
    ...top3.map((p) => ({
      name: p.agent,
      value: p.totalProfit || 0,
      displayValue: `$${(p.totalProfit / 1000).toFixed(0)}k`,
      type: 'top',
      color: '#10b981',
    })),
    { name: '', value: 0, displayValue: '', type: 'spacing', color: 'transparent' },
    ...bottom3.map((p) => ({
      name: p.agent,
      value: p.totalProfit || 0,
      displayValue: `$${(p.totalProfit / 1000).toFixed(0)}k`,
      type: 'bottom',
      color: '#ef4444',
    })),
  ];

  const avgProfit = topPerformers.length > 0
    ? topPerformers.reduce((sum, p) => sum + (p.totalProfit || 0), 0) / topPerformers.length
    : 0;

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-8 mb-8 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Top & Bottom 5 Performers (by Sales Volume)
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-400 rounded-sm"></div>
            <span className="text-slate-300">Top Performer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            <span className="text-slate-300">Bottom Performer</span>
          </div>
          <div className="w-px h-6 bg-slate-700 hidden sm:block"></div>
          <span className="text-slate-200 font-semibold">
            Avg: ${(avgProfit / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <div className="flex gap-2 md:gap-6 min-w-min md:min-w-full">
        <div className="w-20 md:w-32 flex flex-col justify-start pt-2 flex-shrink-0">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="h-8 flex items-center text-xs md:text-sm"
              style={{
                marginBottom: idx === 2 ? '15px' : '0px',
              }}
            >
              {item.type !== 'spacing' && (
                <span className="font-medium text-white truncate">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={chartData.length * 36 + 16}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={true}
                horizontal={false}
              />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis type="category" tick={false} width={0} />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[0, 6, 6, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === 'spacing' ? 'transparent' : entry.color}
                    style={{ cursor: 'default' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-20 md:w-24 flex flex-col justify-start pt-2 text-right flex-shrink-0">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="h-8 flex items-center justify-end text-xs md:text-sm"
              style={{
                marginBottom: idx === 2 ? '15px' : '0px',
              }}
            >
              {item.type !== 'spacing' && (
                <span className="font-semibold text-white">
                  {item.displayValue}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
