'use client';

import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Users,
  Package,
  Settings,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
  { label: 'Analytics', icon: TrendingUp, href: '#' },
  { label: 'Reports', icon: FileText, href: '#' },
  { label: 'Customers', icon: Users, href: '#' },
  { label: 'Products', icon: Package, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 w-56 h-[calc(100vh-64px)] bg-slate-900/80 border-r border-slate-800 overflow-y-auto z-40">
      {/* Navigation Items */}
      <div className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.active
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-600'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-4 right-4 px-2">
        <button className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
          <ChevronDown className="w-4 h-4 rotate-90" />
          <span className="text-sm">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
