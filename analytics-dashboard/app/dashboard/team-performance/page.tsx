'use client';

import { useState } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import DashboardNav from '../components/DashboardNav';
import Sidebar from '../components/Sidebar';
import TeamCards from './components/TeamCards';
import TeamLeadMatrix from './components/TeamLeadMatrix';
import DetailedMetricsChart from './components/DetailedMetricsChart';
import { useProfitByTeam, useTeamLeadMatrix } from '@/hooks/useAnalytics';
import { useSidebar } from '@/lib/context/SidebarContext';

export default function TeamPerformancePage() {
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: teams, isLoading: teamsLoading, refetch: refetchTeams } = useProfitByTeam(dateRange);
  const { data: matrix, isLoading: matrixLoading } = useTeamLeadMatrix();
  const { isCollapsed } = useSidebar();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchTeams?.();
      setRefreshKey(prev => prev + 1);
    } finally {
      setIsRefreshing(false);
    }
  };

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
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Team Performance Overview
              </h1>
              <p className="text-slate-400 mt-1">
                Last Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6">
            {/* <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition">
                <Calendar className="w-4 h-4" />
                Select Date Range
              </button>
            </div> */}

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <TeamCards key={`cards-${refreshKey}`} teams={teams || []} isLoading={teamsLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamLeadMatrix key={`matrix-${refreshKey}`} matrix={matrix || []} isLoading={matrixLoading} />
            <DetailedMetricsChart key={`chart-${refreshKey}`} teams={teams || []} isLoading={teamsLoading} />
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
