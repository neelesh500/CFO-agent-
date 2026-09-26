"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import {
    LayoutDashboard,
    Cpu,
    Gavel,
    Database,
    TrendingUp,
    ShieldCheck,
    FileBarChart,
    Settings,
    Briefcase,
    LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Agent Room', href: '/agent-room', icon: Cpu },
    { name: 'Decisions', href: '/decisions', icon: Gavel },
    { name: 'Data Control', href: '/data-control', icon: Database, role: 'CFO_ADMIN' },
    { name: 'Forecasts', href: '/forecasts', icon: TrendingUp },
    { name: 'Governance', href: '/governance', icon: ShieldCheck },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
    { name: 'Settings', href: '/settings', icon: Settings, role: 'CFO_ADMIN' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="w-64 panel border-r border-[#ffffff0a] flex flex-col h-full relative z-10">
            <div className="p-6 flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                    <Briefcase className="text-white w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Vittya AI System</h1>
                    {user && <p className="text-xs text-blue-400 mt-1 uppercase tracking-wider">{user.role}</p>}
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.filter(item => !item.role || item.role === user?.role).map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${isActive
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-5 border-t border-[#ffffff0a]">
                <button onClick={logout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mb-3">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
                <div className="flex items-center space-x-3 rounded-md p-3 bg-[#1e2128]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-gray-300">Azure Engine Live</span>
                </div>
            </div>
        </div>
    );
}
