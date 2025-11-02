'use client';

interface TeamLeadMatrixProps {
  matrix: any[];
  isLoading: boolean;
}

export default function TeamLeadMatrix({ matrix, isLoading }: TeamLeadMatrixProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Team Lead Performance Matrix
        </h3>
        <div className="h-64 bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!matrix || matrix.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Team Lead Performance Matrix
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  // Group matrix data by team and lead source
  const teamLeads = matrix.reduce((acc: any, item: any) => {
    if (!acc[item.team]) {
      acc[item.team] = [];
    }
    acc[item.team].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Team Lead Performance Matrix
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase w-1/4">
                Team / Lead
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase w-1/4">
                Total Profit
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase w-1/4">
                Job Count
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase w-1/4">
                Payment Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(teamLeads).map(([team, leads]: [string, any]) => [
              // Team Header Row
              <tr key={`${team}-header`} className="border-b border-slate-700/30 bg-slate-800/20">
                <td colSpan={4} className="px-6 py-3 text-xs font-bold text-white">
                  {team}
                </td>
              </tr>,
              // Lead Source Rows - Using REAL data from endpoint
              ...(leads as any[]).map((lead, idx) => (
                <tr
                  key={`${team}-${idx}`}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30 transition"
                >
                  <td className="px-6 py-3 text-slate-300 w-1/4">
                    {lead.leadSource || 'N/A'}
                  </td>
                  <td className="px-6 py-3 w-1/4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      ${(lead.totalProfit || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3 w-1/4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                      {(lead.jobCount || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3 w-1/4">
                    <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold">
                      {((lead.paymentRate || 0)).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
    </div>
  );
}
