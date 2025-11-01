'use client';

import { useState } from 'react';
import {
  Download,
  ChevronDown,
  DollarSign,
  Users,
  ShoppingCart,
  Percent,
  Calendar,
} from 'lucide-react';
import DashboardNav from './components/DashboardNav';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import RecentTransactions from './components/RecentTransactions';
import {
  useSummary,
  useProfitByTeam,
  useProfitByAgent,
  useProfitByLead,
  useTopPerformers,
  useCompanyEfficiency,
  useTrends,
  usePerformanceComparison,
  useLeadROI,
  useTeamLeadMatrix,
  useProfitDistribution,
  useAgentSpecialization,
  usePaymentCollection,
} from '@/hooks/useAnalytics';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | undefined>();

  // ============ ORIGINAL 6 ENDPOINTS ============
  const { data: summary, isLoading: summaryLoading } = useSummary(dateRange);
  const { data: teams, isLoading: teamsLoading } = useProfitByTeam(dateRange);
  const { data: agents, isLoading: agentsLoading } =
    useProfitByAgent(dateRange);
  const { data: leadSources, isLoading: leadSourcesLoading } =
    useProfitByLead();
  const { data: topPerformers, isLoading: topPerformersLoading } =
    useTopPerformers(10);
  const { data: efficiency, isLoading: efficiencyLoading } =
    useCompanyEfficiency();

  // ============ ADVANCED 7 ENDPOINTS ============
  const { data: trends, isLoading: trendsLoading } = useTrends(dateRange);
  const { data: comparison, isLoading: comparisonLoading } =
    usePerformanceComparison();
  const { data: leadROI, isLoading: leadROILoading } = useLeadROI();
  const { data: teamLeadMatrix, isLoading: teamMatrixLoading } =
    useTeamLeadMatrix();
  const { data: profitDist, isLoading: profitDistLoading } =
    useProfitDistribution();
  const { data: specialization, isLoading: specializationLoading } =
    useAgentSpecialization();
  const { data: paymentCollection, isLoading: paymentLoading } =
    usePaymentCollection();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <DashboardNav />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-56 mt-16 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Sales Overview
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              {/* Date Range Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition">
                  <Calendar className="w-4 h-4" />
                  Last 30 Days
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {/* ============ KPI CARDS - Using useSummary() ============ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Profit"
              value={
                summary
                  ? `$${(summary.totalProfit || 0).toLocaleString()}`
                  : '-'
              }
              change="+20.1% from last month"
              changeType="positive"
              icon={DollarSign}
              isLoading={summaryLoading}
            />
            <StatCard
              title="Total Agents"
              value={summary?.totalAgents || '-'}
              change="+15.2% from last month"
              changeType="positive"
              icon={Users}
              isLoading={summaryLoading}
            />
            <StatCard
              title="Avg Profit/Agent"
              value={
                summary
                  ? `$${(summary.avgProfitPerAgent || 0).toLocaleString()}`
                  : '-'
              }
              change="-2.1% from last month"
              changeType="negative"
              icon={ShoppingCart}
              isLoading={summaryLoading}
            />
            <StatCard
              title="Conversion Rate"
              value={
                summary?.conversionRate
                  ? `${((summary.conversionRate || 0) * 100).toFixed(2)}%`
                  : '-'
              }
              change="+1.2% from last month"
              changeType="positive"
              icon={Percent}
              isLoading={summaryLoading}
            />
          </div>

          {/* ============ CHARTS ROW - Revenue & Profit Distribution ============ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart - Uses useTrends() */}
            <div className="lg:col-span-2">
              <RevenueChart trendsData={trends} isLoading={trendsLoading} />
            </div>

            {/* Profit Distribution - Uses useProfitDistribution() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Profit Distribution
              </h3>
              {profitDistLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-6 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mean</span>
                    <span className="font-semibold text-white">
                      ${(profitDist?.mean || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Median</span>
                    <span className="font-semibold text-white">
                      ${(profitDist?.median || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Std Dev</span>
                    <span className="font-semibold text-white">
                      ${(profitDist?.stdDev || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-3">
                    <span className="text-slate-400">Range</span>
                    <span className="font-semibold text-white">
                      ${(profitDist?.min || 0).toLocaleString()} - $
                      {(profitDist?.max || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============ RECENT TRANSACTIONS ============ */}
          <RecentTransactions />

          {/* ============ BOTTOM SECTION - Multiple Analytics ============ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance - Uses useProfitByTeam() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
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
                        key={team.teamId}
                        className="flex justify-between items-center pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div>
                          <p className="text-white font-medium">{team.teamName}</p>
                          <p className="text-xs text-slate-400">
                            {(team.agentCount || 0)} agents
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-400">
                            ${(team.profit || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            ${(team.avgProfitPerAgent || 0).toLocaleString()}/agent
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

            {/* Lead Source ROI - Uses useLeadROI() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Lead Source ROI
              </h3>
              {leadROILoading ? (
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
                  {leadROI && leadROI.length > 0 ? (
                    leadROI.map((item) => (
                      <div
                        key={item.method}
                        className="flex justify-between items-center pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div>
                          <p className="text-white font-medium capitalize">
                            {item.method}
                          </p>
                          <p className="text-xs text-slate-400">
                            Return: ${(item.totalReturn || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-400">
                            {((item.roi_percentage || item.roi * 100) || 0).toFixed(1)}%
                          </p>
                          <p className="text-xs text-slate-400">ROI</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No ROI data available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ============ ADVANCED SECTION ============ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performers - Uses useTopPerformers() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Top Performers
              </h3>
              {topPerformersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {topPerformers && topPerformers.length > 0 ? (
                    topPerformers.slice(0, 5).map((agent, index) => (
                      <div
                        key={agent.agentId}
                        className="flex justify-between items-start pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {agent.agentName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {agent.department}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-emerald-400 text-sm">
                          ${(agent.totalProfit || 0).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No performer data available
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Agent Specialization - Uses useAgentSpecialization() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Agent Specialization
              </h3>
              {specializationLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {specialization && specialization.length > 0 ? (
                    specialization.slice(0, 5).map((agent) => (
                      <div
                        key={agent.agentId}
                        className="pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium text-sm">
                            {agent.agentName}
                          </p>
                          <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                            {agent.bestMethod}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Best profit: ${(agent.bestMethodProfit || 0).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No specialization data available
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Collection - Uses usePaymentCollection() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Payment Collection
              </h3>
              {paymentLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentCollection && paymentCollection.length > 0 ? (
                    paymentCollection.slice(0, 5).map((item) => (
                      <div
                        key={item.agentId}
                        className="flex justify-between items-center pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div>
                          <p className="text-white font-medium text-sm">
                            {item.agentName}
                          </p>
                          <p className="text-xs text-slate-400">
                            Collected: $
                            {(item.totalCollected || 0).toLocaleString()}
                          </p>
                        </div>
                        <span className="font-semibold text-emerald-400 text-sm">
                          {(((item.collectionRate || 0) * 100)).toFixed(1)}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No payment data available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ============ ADDITIONAL INSIGHTS ============ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Source Effectiveness - Uses useProfitByLead() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Lead Source Effectiveness
              </h3>
              {leadSourcesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
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
                        key={source.method}
                        className="pb-3 border-b border-slate-700/30 last:border-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium capitalize">
                            {source.method}
                          </p>
                          <p className="text-sm text-emerald-400 font-semibold">
                            ${(source.totalProfit || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span>Leads: {(source.leadCount || 0)}</span>
                          <span>
                            Avg: $
                            {(source.avgProfitPerLead || 0).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                          <span>
                            Conv:{' '}
                            {(((source.conversionRate || 0) * 100)).toFixed(
                              1
                            )}
                            %
                          </span>
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

            {/* Performance Comparison - Uses usePerformanceComparison() */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Performance Comparison
              </h3>
              {comparisonLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Average Metrics */}
                  <div className="pb-4 border-b border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">
                      Average Metrics
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Profit:</span>
                        <span className="text-white font-medium">
                          $
                          {(comparison?.averageMetrics?.avgProfit || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Leads:</span>
                        <span className="text-white font-medium">
                          {(comparison?.averageMetrics?.avgLeads || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Conv:</span>
                        <span className="text-white font-medium">
                          {(
                            ((comparison?.averageMetrics?.avgConversion || 0) * 100)
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Performer */}
                  {comparison?.topPerformers &&
                    comparison.topPerformers.length > 0 && (
                      <div className="pb-4 border-b border-slate-700">
                        <h4 className="text-sm font-semibold text-emerald-400 mb-2">
                          Top Performer
                        </h4>
                        <p className="text-sm text-white">
                          {comparison.topPerformers.agentName}
                        </p>
                        <p className="text-xs text-slate-400">
                          ${(comparison.topPerformers.totalProfit || 0).toLocaleString()}
                        </p>
                      </div>
                    )}

                  {/* Bottom Performer */}
                  {comparison?.bottomPerformers &&
                    comparison.bottomPerformers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-2">
                          Needs Improvement
                        </h4>
                        <p className="text-sm text-white">
                          {comparison.bottomPerformers.agentName}
                        </p>
                        <p className="text-xs text-slate-400">
                          ${(comparison.bottomPerformers.totalProfit || 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
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
