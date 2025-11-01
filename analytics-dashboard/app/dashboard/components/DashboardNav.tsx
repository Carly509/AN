'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart3,
  LogOut,
  Bell,
  ChevronDown,
} from 'lucide-react';

export default function DashboardNav() {
  const { logout, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SalesCorp</span>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search transactions, customers"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications + User Menu */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800/50 rounded-lg transition"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">
                  Alex Turner
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
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
