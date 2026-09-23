"use client";

import { useState } from 'react';
import { Target, TrendingUp, TrendingDown, Percent, Settings2 } from 'lucide-react';

const SCENARIOS = [
    { id: 'base', name: 'Base Case', probability: 60, rev: '$2.15M', margin: '18.4%', cash: '$5.8M', color: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
    { id: 'optimistic', name: 'Optimistic', probability: 25, rev: '$2.42M', margin: '21.2%', cash: '$6.8M', color: 'border-brand-mint', bg: 'bg-brand-mint/10', text: 'text-brand-mint' },
    { id: 'conservative', name: 'Conservative', probability: 15, rev: '$1.88M', margin: '15.6%', cash: '$4.8M', color: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-500' },
];

export default function ForecastsPage() {
    const [active, setActive] = useState('base');
    const [confidence, setConfidence] = useState(85);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Forecasts & Scenarios</h1>
                    <p className="text-gray-400 text-sm mt-1">Multi-Agent probabilistic modeling.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scenarios Selection */}
                <div className="flex flex-col space-y-4">
                    {SCENARIOS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActive(s.id)}
                            className={`text-left p-5 rounded-2xl glass-panel transition-all duration-300 border-l-4 ${active === s.id ? s.color + ' bg-white/5' : 'border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-lg">{s.name}</span>
                                <span className={`text-sm font-bold px-2 py-1 rounded-md ${s.bg} ${s.text}`}>{s.probability}% Prob</span>
                            </div>
                            <div className="flex space-x-4 mt-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-medium">Q2 Revenue</div>
                                    <div className="font-semibold">{s.rev}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-medium">Margin</div>
                                    <div className="font-semibold">{s.margin}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detailed View & Modifiers */}
                <div className="col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>

                    {SCENARIOS.filter(s => s.id === active).map(s => (
                        <div key={s.id} className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className={`p-2 rounded-lg ${s.bg} ${s.text}`}>
                                    <Target className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">{s.name} Projection Details</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="bg-[#1a1d27] p-5 rounded-xl border border-[#ffffff10]">
                                    <div className="text-sm text-gray-400 mb-1">Projected Revenue</div>
                                    <div className={`text-3xl font-bold ${s.text}`}>{s.rev}</div>
                                </div>
                                <div className="bg-[#1a1d27] p-5 rounded-xl border border-[#ffffff10]">
                                    <div className="text-sm text-gray-400 mb-1">Cash Position</div>
                                    <div className="text-3xl font-bold text-white">{s.cash}</div>
                                </div>
                                <div className="bg-[#1a1d27] p-5 rounded-xl border border-[#ffffff10]">
                                    <div className="text-sm text-gray-400 mb-1">Operating Margin</div>
                                    <div className="text-3xl font-bold text-gray-300">{s.margin}</div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-2 mt-4">
                                    <h3 className="font-medium flex items-center">
                                        <Settings2 className="w-4 h-4 mr-2" />
                                        Model Confidence Threshold
                                    </h3>
                                    <span className="text-brand-cyan font-bold">{confidence}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="50" max="99"
                                    value={confidence}
                                    onChange={(e) => setConfidence(Number(e.target.value))}
                                    className="w-full h-2 bg-[#1a1d27] rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Broader Estimates</span>
                                    <span>Strict AI Filters</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
