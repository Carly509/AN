'use client';

import { useState } from 'react';
import {
  Download,
  ChevronDown,
  DollarSign,
  Briefcase,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';
import DashboardNav from './components/DashboardNav';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ProfitDistributionChart from './components/ProfitDistributionChart';
import RecentTransactions from './components/RecentTransactions';
import { useSidebar } from '@/lib/context/SidebarContext';
import {
  useSummary,
  useProfitByTeam,
  useProfitByLead,
  useAgentSpecialization,
  useTrends,
  useProfitDistribution
} from '@/hooks/useAnalytics';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | undefined>();
  const { isCollapsed } = useSidebar();

  const { data: summary, isLoading: summaryLoading } = useSummary(dateRange);
  const { data: teams, isLoading: teamsLoading } = useProfitByTeam(dateRange);
  const { data: leadSources, isLoading: leadSourcesLoading } = useProfitByLead();
  const { data: agents, isLoading: agentsLoading } = useAgentSpecialization();
  const { data: trends, isLoading: trendsLoading } = useTrends(dateRange);
  const { data: profitDist, isLoading: profitDistLoading } = useProfitDistribution();

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardNav />
      <Sidebar />

      <main
        className={`mt-16 p-3 md:p-6 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'ml-0 lg:ml-20' : 'ml-0 lg:ml-56'
        }`}
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Sales Overview
              </h1>
              <p className="text-slate-400 mt-2">
                Here's a look at your sales performance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm">
                  <Calendar className="w-4 h-4" />
                  Last 30 Days
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Total Profit"
              value={
                summary
                  ? `$${(summary.totalProfit || 0).toLocaleString()}`
                  : '-'
              }
              change={`${((summary?.paymentRate || 0)).toFixed(1)}% payment rate`}
              changeType="positive"
              icon={DollarSign}
              isLoading={summaryLoading}
            />
            <StatCard
              title="Total Jobs"
              value={summary?.totalJobs || '-'}
              change={`${(summary?.paidJobs || 0).toLocaleString()} paid`}
              changeType="positive"
              icon={Briefcase}
              isLoading={summaryLoading}
            />
            <StatCard
              title="Avg Profit/Job"
              value={
                summary
                  ? `$${(summary.avgProfitPerJob || 0).toLocaleString()}`
                  : '-'
              }
              change={`${(summary?.unpaidJobs || 0).toLocaleString()} unpaid`}
              changeType="neutral"
              icon={TrendingUp}
              isLoading={summaryLoading}
            />
            <StatCard
              title="Paid Jobs"
              value={summary?.paidJobs || '-'}
              change={`$${(summary?.paidProfit || 0).toLocaleString()}`}
              changeType="positive"
              icon={Users}
              isLoading={summaryLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <ProfitDistributionChart
              data={profitDist}
              isLoading={profitDistLoading}
            />
          </div>

          <RecentTransactions
            performers={agents || []}
            isLoading={agentsLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Team Performance
              </h3>
              {teamsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {teams && teams.length > 0 ? (
                    teams.map((team) => (
                      <div
                        key={team.team}
                        className="flex justify-between items-center pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div>
                          <p className="text-white font-medium text-sm md:text-base">{team.team}</p>
                          <p className="text-xs text-slate-400">
                            {(team.jobCount || 0)} jobs • {((team.paymentRate || 0)).toFixed(1)}% paid
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-400 text-sm md:text-base">
                            ${(team.totalProfit || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            ${(team.avgProfit || 0).toLocaleString()}/job
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No team data available
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Lead Sources
              </h3>
              {leadSourcesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {leadSources && leadSources.length > 0 ? (
                    leadSources.map((source) => (
                      <div
                        key={source.leadSource}
                        className="flex justify-between items-center pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div>
                          <p className="text-white font-medium capitalize text-sm md:text-base">
                            {source.leadSource}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(source.jobCount || 0)} jobs • {((source.conversionRate || 0)).toFixed(1)}% conversion
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-400 text-sm md:text-base">
                            ${(source.totalProfit || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            ${(source.avgProfit || 0).toLocaleString()}/job
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No lead source data available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 flex items-center gap-3 z-30">
        <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </button>
        <button className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
