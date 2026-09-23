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
    BrainCircuit,
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
        <div className="w-64 glass-panel border-r border-[#ffffff14] flex flex-col h-full relative z-10 transition-all duration-300">
            <div className="p-6 flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-mint flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                    <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-wide text-gradient">Vittya AI</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-white/10 text-brand-cyan shadow-[inset_2px_0_0_#00F2FE]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-cyan' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-[#ffffff14]">
                <div className="flex items-center space-x-3 bg-brand-bg rounded-lg p-3 border border-[#ffffff0a]">
                    <div className="w-2 h-2 rounded-full bg-brand-mint-glow shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    <span className="text-xs font-semibold text-gray-300">Azure Engine Live</span>
                </div>
            </div>
        </div>
    );
}
