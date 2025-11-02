'use client';

import { useState } from 'react';
import { Mail, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface AgentDetailCardsProps {
  agents: any[];
  isLoading: boolean;
}

export default function AgentDetailCards({ agents, isLoading }: AgentDetailCardsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(agents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgents = agents.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 md:h-72 bg-slate-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No agent data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mb-6">
        {currentAgents.map((agent) => (
          <div
            key={agent.agent}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-600 transition"
          >
            <div className="bg-slate-800/50 px-3 md:px-4 py-3 md:py-4 border-b border-slate-700/50 flex items-start justify-between">
              <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                  {agent.agent.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-bold text-white truncate">{agent.agent}</p>
                  <p className="text-xs text-slate-400 truncate">{agent.team}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button className="p-1 md:p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white">
                  <Mail className="w-3 md:w-4 h-3 md:h-4" />
                </button>
                <button className="p-1 md:p-1.5 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white">
                  <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 md:p-4 space-y-3 md:space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Sales</p>
                <p className="text-base md:text-lg font-bold text-white">
                  ${(agent.bestLeadProfit / 1000).toFixed(1)}k
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 md:p-3">
                <p className="text-xs text-slate-400 mb-2">Best Performing Lead Source</p>
                <p className="text-xs md:text-sm font-bold text-white mb-2">{agent.bestLeadSource}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-slate-400">Conversion</p>
                    <p className="text-xs md:text-sm font-semibold text-emerald-400">
                      {((agent.bestLeadJobCount / 200) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Leads</p>
                    <p className="text-xs md:text-sm font-semibold text-blue-400">
                      {agent.bestLeadJobCount}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">All Lead Sources</p>
                <div className="space-y-1 md:space-y-2">
                  {(agent.allLeadSources || []).map((lead: any) => (
                    <div key={lead.leadSource} className="flex items-center justify-between bg-slate-800/30 p-1.5 md:p-2 rounded text-xs">
                      <p className="font-medium text-slate-300 truncate">{lead.leadSource}</p>
                      <div className="flex gap-1 md:gap-2 flex-shrink-0">
                        <p className="text-slate-400">${(lead.totalProfit / 1000).toFixed(1)}k</p>
                        <p className="text-blue-400 font-medium">{lead.jobCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-700/30">
          <div className="text-xs md:text-sm text-slate-400">
            Showing {startIndex + 1} to {Math.min(endIndex, agents.length)} of {agents.length} agents
          </div>

          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs md:text-sm text-slate-300 font-medium mx-2">
              {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
