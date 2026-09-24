"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Agent Room', href: '/agent-room', icon: Cpu },
    { name: 'Decisions', href: '/decisions', icon: Gavel },
    { name: 'Data Control', href: '/data-control', icon: Database },
    { name: 'Forecasts', href: '/forecasts', icon: TrendingUp },
    { name: 'Governance', href: '/governance', icon: ShieldCheck },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 panel border-r border-[#ffffff0a] flex flex-col h-full relative z-10">
            <div className="p-6 flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                    <Briefcase className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">Vittya AI</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
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
                <div className="flex items-center space-x-3 rounded-md p-3 bg-[#1e2128]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-gray-300">Azure Engine Live</span>
                </div>
            </div>
        </div>
    );
}
