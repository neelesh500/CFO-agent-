"use client";
import { useEffect, useState } from 'react';
import { Gavel, Check, X, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const backend_url = "http://127.0.0.1:8000";

export default function DecisionsPage() {
    const { user } = useAuth();
    const [decisions, setDecisions] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        fetch(`${backend_url}/api/decisions`, { headers: { 'Authorization': `Bearer ${user.token}` } })
            .then(res => res.json()).then(setDecisions);
    }, [user]);

    const actOnDecision = async (id: number, action: string) => {
        if (!user || user.role !== 'CFO_ADMIN') {
            alert("Only CFO_ADMIN can approve decisions.");
            return;
        }
        await fetch(`${backend_url}/api/decisions/${id}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({ action })
        });
        const res = await fetch(`${backend_url}/api/decisions`, { headers: { 'Authorization': `Bearer ${user.token}` } });
        setDecisions(await res.json());
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#ffffff1a]">
                <div className="w-10 h-10 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center">
                    <Gavel className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Autonomous Decisions & Approvals</h1>
                    <p className="text-gray-400 text-sm">Human-in-the-loop oversight for Agentic Actions</p>
                </div>
            </div>

            <div className="panel p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center">
                        <ShieldAlert className="w-5 h-5 mr-2 text-yellow-400" /> Pending AI Proposals
                    </h2>
                    <div className="text-xs text-gray-400 flex items-center bg-[#181a1f] px-3 py-1.5 rounded-full border border-[#ffffff1a]">
                        <Cpu className="w-3 h-3 mr-1.5 text-brand-cyan" /> Scikit-Learn Model Active
                    </div>
                </div>

                <div className="space-y-4">
                    {decisions.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">No pending decisions.</p>
                    ) : decisions.map(d => (
                        <div key={d.id} className="bg-[#12141c] border border-[#ffffff0a] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-medium text-white mb-1">{d.agent_proposal}</h3>
                                <p className="text-xs text-gray-500">Proposed: {d.date} • Status: <span className={d.status.includes('Pending') ? 'text-yellow-400' : d.status.includes('Approve') ? 'text-green-400' : 'text-red-400'}>{d.status}</span></p>
                            </div>

                            {d.status === 'Pending Approval' ? (
                                <div className="flex space-x-3 shrink-0">
                                    <button
                                        onClick={() => actOnDecision(d.id, 'Approve')}
                                        className="flex items-center px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-md transition-colors text-sm font-medium border border-green-500/20"
                                    >
                                        <Check className="w-4 h-4 mr-1.5" /> Approve
                                    </button>
                                    <button
                                        onClick={() => actOnDecision(d.id, 'Reject')}
                                        className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition-colors text-sm font-medium border border-red-500/20"
                                    >
                                        <X className="w-4 h-4 mr-1.5" /> Reject
                                    </button>
                                </div>
                            ) : (
                                <div className="shrink-0 px-4 py-2 rounded-md bg-[#181a1f] border border-[#ffffff0a] text-xs font-medium text-gray-400">
                                    Action Completed
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Human-in-the-loop decisions queue wrapper

