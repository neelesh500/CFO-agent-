"use client";

import { useState } from 'react';
import {
    Bell,
    Mic,
    User,
    Search,
    MicOff,
    ChevronDown
} from 'lucide-react';

export default function Topbar() {
    const [isLive, setIsLive] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(false);

    return (
        <header className="h-16 panel border-b border-[#ffffff0a] flex items-center justify-between px-6 z-20 sticky top-0">
            <div className="flex items-center w-96 bg-[#1e2128] border border-[#ffffff0a] rounded-md px-3 py-1.5 focus-within:border-blue-500/50 transition-colors">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Ask Vittya anything..."
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
            </div>

            <div className="flex items-center space-x-5">
                {/* Status Toggle */}
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center space-x-2 px-2.5 py-1 rounded-md border transition-all ${isLive
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                        }`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                    <span className="text-xs font-medium">{isLive ? 'Live' : 'Idle'}</span>
                </button>

                {/* Audio Toggle */}
                <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-1.5 rounded-md transition-colors ${audioEnabled ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                >
                    {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button className="text-gray-400 hover:text-gray-200 hover:bg-white/5 p-1.5 rounded-md transition-colors relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                </button>

                <div className="w-px h-5 bg-[#ffffff1a] mx-1"></div>

                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                    <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium mr-1">CFO Profile</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
            </div>
        </header>
    );
}
