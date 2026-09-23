"use client";

import { useState } from 'react';
import {
    Bell,
    Mic,
    Sun,
    Moon,
    User,
    Search,
    MicOff
} from 'lucide-react';

export default function Topbar() {
    const [isLive, setIsLive] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(false);

    return (
        <header className="h-20 glass-panel border-b border-[#ffffff14] flex items-center justify-between px-8 z-20">
            <div className="flex items-center w-96 glass-panel rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Ask Vittya anything..."
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
            </div>

            <div className="flex items-center space-x-6">
                {/* Status Toggle */}
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${isLive
                            ? 'border-brand-mint text-brand-mint bg-brand-mint/10'
                            : 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                        }`}
                >
                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-brand-mint animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-xs font-semibold">{isLive ? 'Live' : 'Idle'}</span>
                </button>

                {/* Audio Toggle */}
                <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-2 rounded-full transition-all ${audioEnabled ? 'bg-brand-cyan/20 text-brand-cyan shadow-[0_0_10px_rgba(0,242,254,0.3)]' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button className="text-gray-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute 0 top-0 right-0 w-2 h-2 bg-brand-cyan rounded-full border-[1.5px] border-brand-panel"></span>
                </button>

                <div className="w-px h-6 bg-[#ffffff1a] mx-2"></div>

                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">CFO Profile</span>
                </button>
            </div>
        </header>
    );
}
