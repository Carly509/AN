'use client';

import { useState } from 'react';
import DashboardNav from '../components/DashboardNav';
import Sidebar from '../components/Sidebar';
import TopBottomPerformersChart from './components/TopBottomPerformersChart';
import AgentDetailCards from './components/AgentDetailCards';
import { usePerformanceComparison, useAgentSpecialization } from '@/hooks/useAnalytics';
import { useSidebar } from '@/lib/context/SidebarContext';

export default function AgentPerformancePage() {
  const { data: comparison, isLoading: comparisonLoading } = usePerformanceComparison();
  const { data: specialization, isLoading: specializationLoading } = useAgentSpecialization();
  const { isCollapsed } = useSidebar();

  const topPerformers = comparison?.topPerformers || [];
  const bottomPerformers = comparison?.bottomPerformers || [];

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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Agent Performance Analytics</h1>

        <TopBottomPerformersChart
          topPerformers={topPerformers}
          bottomPerformers={bottomPerformers}
          isLoading={comparisonLoading}
        />

        <AgentDetailCards agents={specialization || []} isLoading={specializationLoading} />
      </main>

      <div className="fixed bottom-8 right-8 flex items-center gap-3 z-30">
        <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
