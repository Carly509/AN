'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart3,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export default function DashboardNav() {
  const { logout, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800/50 rounded-lg transition"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">
                  User Name
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <p className="text-sm font-semibold text-white">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {user?.role || 'user'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
