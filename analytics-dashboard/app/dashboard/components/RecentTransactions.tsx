'use client';

import {
  CheckCircle,
  TrendingUp,
  Clock,
  XCircle,
} from 'lucide-react';

interface Transaction {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Shipped' | 'Pending' | 'Cancelled';
}

const transactions: Transaction[] = [
  {
    id: '#INV-00123',
    customer: 'Liam Johnson',
    date: '2023-10-26',
    amount: 250,
    status: 'Paid',
  },
  {
    id: '#INV-00124',
    customer: 'Olivia Smith',
    date: '2023-10-25',
    amount: 150,
    status: 'Shipped',
  },
  {
    id: '#INV-00125',
    customer: 'Noah Williams',
    date: '2023-10-25',
    amount: 350,
    status: 'Pending',
  },
  {
    id: '#INV-00126',
    customer: 'Emma Brown',
    date: '2023-10-24',
    amount: 450,
    status: 'Cancelled',
  },
];

const statusConfig = {
  Paid: {
    styles: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    icon: CheckCircle,
  },
  Shipped: {
    styles: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    icon: TrendingUp,
  },
  Pending: {
    styles: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    icon: Clock,
  },
  Cancelled: {
    styles: 'bg-red-500/20 text-red-400 border border-red-500/30',
    icon: XCircle,
  },
};

export default function RecentTransactions() {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Recent Transactions
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Invoice ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const StatusIcon =
                statusConfig[tx.status]?.icon || CheckCircle;
              const statusStyles = statusConfig[tx.status]?.styles;

              return (
                <tr
                  key={tx.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30 transition"
                >
                  <td className="px-4 py-4 text-sm font-medium text-white">
                    {tx.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {tx.customer}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {tx.date}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-white">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {tx.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-6 pt-6 border-t border-slate-700/30 flex items-center justify-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
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
        <span className="text-sm text-slate-400">1 of 10</span>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
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
  );
}
