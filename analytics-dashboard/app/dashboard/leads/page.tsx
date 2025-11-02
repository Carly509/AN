'use client';

import { Calendar } from 'lucide-react';
import DashboardNav from '../components/DashboardNav';
import Sidebar from '../components/Sidebar';
import LeadSourceROI from './components/LeadSourceROI';
import PaymentRateLeaderboard from './components/PaymentRateLeaderboard';
import { useLeadROI, usePaymentCollection } from '@/hooks/useAnalytics';
import { useSidebar } from '@/lib/context/SidebarContext';

export default function LeadsPage() {
  const { data: leadROI, isLoading: leadROILoading } = useLeadROI();
  const { data: paymentCollection, isLoading: paymentLoading } = usePaymentCollection();
  const { isCollapsed } = useSidebar();

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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Leads & ROI Analysis</h1>
              <p className="text-slate-400 mt-2 text-sm md:text-base">Sales performance and lead conversion overview.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm w-full md:w-auto justify-center md:justify-start">
              <Calendar className="w-4 h-4" />
              <span>Oct 1, 2023 - Oct 31, 2023</span>
            </button>
          </div>
        </div>

        <LeadSourceROI data={leadROI || []} isLoading={leadROILoading} />
        <PaymentRateLeaderboard data={paymentCollection || []} isLoading={paymentLoading} />
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
