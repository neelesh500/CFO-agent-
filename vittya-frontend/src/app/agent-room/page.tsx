"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, Activity, Mic, SquareTerminal, Bot, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LogEntry = {
    timestamp: string;
    agent: string;
    message: string;
    type: 'execution_log' | 'system' | 'user_input' | 'agent_reasoning' | 'agent_action';
};

export default function AgentRoomPage() {
    const [activeMode, setActiveMode] = useState('Autonomous');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [query, setQuery] = useState('');
    const [agentState, setAgentState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const ws = useRef<WebSocket | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Connect to FastAPI WebSocket
        ws.current = new WebSocket('ws://127.0.0.1:8000/ws/agent-room');

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs((prev) => [...prev, data]);

            if (data.type === 'agent_reasoning') setAgentState('processing');
            else if (data.type === 'agent_action') {
                setAgentState('speaking');
                setTimeout(() => setAgentState('idle'), 3000);
            }
            else if (data.type === 'execution_log') {
                // Flash processing briefly on random background tasks
                if (agentState === 'idle') {
                    setAgentState('processing');
                    setTimeout(() => setAgentState('idle'), 500);
                }
            }
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !ws.current) return;

        setAgentState('listening');
        ws.current.send(query);
        setQuery('');
    };

    const modes = ['Autonomous', 'Assisted', 'Manual', 'Voice Only'];

    const getAgentColor = (agent: string) => {
        if (agent.includes('Data')) return 'text-blue-400';
        if (agent.includes('Bookkeeping')) return 'text-green-400';
        if (agent.includes('Reconciliation')) return 'text-yellow-400';
        if (agent.includes('Insight')) return 'text-purple-400';
        if (agent.includes('Decision')) return 'text-brand-cyan';
        if (agent === 'System') return 'text-gray-400';
        return 'text-brand-mint';
    };

    return (
        <div className="h-full flex flex-col space-y-6">

            {/* Top Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Agent Room</h1>
                    <p className="text-gray-400 text-sm mt-1">Live Multi-Agent Operations Hub.</p>
                </div>

                {/* Mode Switcher */}
                <div className="glass-panel p-1.5 rounded-xl flex space-x-1">
                    {modes.map(mode => (
                        <button
                            key={mode}
                            onClick={() => setActiveMode(mode)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === mode
                                ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

                {/* Central Visualizer & Prompting */}
                <div className="col-span-2 flex flex-col space-y-6 min-h-0">

                    {/* Visualizer Area */}
                    <div className="flex-1 glass-panel rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#00F2FE]/5 to-transparent pointer-events-none" />

                        {/* The Avatar / Orb */}
                        <div className="relative flex items-center justify-center w-64 h-64">
                            <motion.div
                                animate={{
                                    scale: agentState === 'processing' ? [1, 1.2, 1] : agentState === 'listening' ? [1, 1.05, 1] : 1,
                                    rotate: agentState === 'processing' ? 360 : 0
                                }}
                                transition={{ repeat: Infinity, duration: agentState === 'processing' ? 2 : 4, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-brand-cyan/30 border-dashed"
                            />
                            <motion.div
                                animate={{
                                    scale: agentState === 'speaking' ? [1, 1.15, 1] : 1,
                                    opacity: agentState === 'idle' ? 0.5 : 1
                                }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.3)] transition-colors duration-500 ${agentState === 'idle' ? 'bg-brand-panel border border-brand-cyan/20' :
                                    agentState === 'listening' ? 'bg-brand-mint/20 border-brand-mint' :
                                        agentState === 'processing' ? 'bg-brand-cyan/30 border-brand-cyan' :
                                            'bg-white/20 border-white'
                                    }`}
                            >
                                <Bot className={`w-12 h-12 ${agentState === 'listening' ? 'text-brand-mint' : 'text-brand-cyan'} drop-shadow-[0_0_10px_currentColor]`} />
                            </motion.div>
                        </div>

                        <div className="mt-8 text-center bg-[#090a0f]/50 px-6 py-2 rounded-full border border-[#ffffff10] backdrop-blur-md">
                            <span className="text-sm font-medium tracking-widest uppercase text-brand-cyan flex items-center space-x-2">
                                <Activity className="w-4 h-4 mr-1 animate-pulse" />
                                Status: {agentState.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Natural Language Prompt */}
                    <div className="glass-panel p-4 rounded-2xl relative shadow-lg">
                        <form onSubmit={handleSubmit} className="flex flex-col relative w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask Vittya CFO... (e.g., 'Forecast cash position for next quarter')"
                                    className="w-full bg-[#1a1d27] border border-[#ffffff1a] rounded-xl px-4 py-4 pr-16 text-white placeholder:text-gray-500 outline-none focus:border-brand-cyan/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!query.trim()}
                                    className="absolute right-2 top-2 bottom-2 p-2 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Execution Timeline / Live Log */}
                <div className="glass-panel rounded-2xl flex flex-col min-h-0 bg-[#090a0f]/80 relative overflow-hidden">
                    <div className="p-4 border-b border-[#ffffff10] flex justify-between items-center bg-[#12141c]">
                        <h3 className="font-semibold text-sm flex items-center">
                            <SquareTerminal className="w-4 h-4 mr-2 text-brand-cyan" />
                            Live Execution Log
                        </h3>
                        <span className="flex items-center text-xs text-brand-mint font-medium bg-brand-mint/10 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 bg-brand-mint rounded-full animate-pulse mr-1.5"></span>
                            Streaming
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[13px]">
                        <AnimatePresence initial={false}>
                            {logs.map((log, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex items-start space-x-3 ${log.type === 'user_input' ? 'bg-white/5 p-2 rounded border border-white/10' : ''}`}
                                >
                                    <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                                    <div className="flex-1">
                                        <span className={`font-semibold mr-2 ${getAgentColor(log.agent)}`}>
                                            {log.agent}:
                                        </span>
                                        <span className={`${log.type === 'agent_reasoning' ? 'italic text-gray-400' : 'text-gray-300'}`}>
                                            {log.message}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={logsEndRef} />
                    </div>
                </div>

            </div>
        </div>
    );
}
