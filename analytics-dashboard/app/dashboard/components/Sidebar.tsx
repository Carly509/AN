'use client';

import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Users,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/lib/context/SidebarContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Team Performance', icon: TrendingUp, href: '/dashboard/team-performance' },
  { label: 'Leads', icon: FileText, href: '/dashboard/leads' },
  { label: 'Agent Performance', icon: Users, href: '/dashboard/agent-performance' },
];

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition lg:hidden"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-slate-900/80 border-r border-slate-800 overflow-y-auto z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-56'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 right-4 hidden lg:flex">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-2 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
