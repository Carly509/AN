'use client';

import { useState } from 'react';
import type { TopPerformer } from '@/lib/types';

interface RecentTransactionsProps {
  performers?: TopPerformer[];
  isLoading?: boolean;
}

export default function RecentTransactions({
  performers = [],
  isLoading = false,
}: RecentTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(performers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPerformers = performers.slice(startIndex, endIndex);

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Top Performers
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-700 rounded animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Team (Job Type)
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPerformers && currentPerformers.length > 0 ? (
                  currentPerformers.map((performer, index) => (
                    <tr
                      key={performer.agent}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {startIndex + index + 1}
                          </div>
                          {performer.agent}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {performer.team}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {(performer.jobCount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-emerald-400">
                        ${(performer.totalProfit || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      No performer data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 pt-6 border-t border-slate-700/30 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to {Math.min(endIndex, performers.length)} of{' '}
              {performers.length} performers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-sm text-slate-400">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
