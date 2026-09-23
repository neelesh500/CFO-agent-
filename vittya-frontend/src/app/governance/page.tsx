"use client";

import { Shield, Server, Database, Key, CheckCircle, AlertTriangle, Fingerprint } from 'lucide-react';

const INFRASTRUCTURE = [
    { name: 'Azure Active Directory', status: 'Secured', icon: Fingerprint, color: 'text-blue-400' },
    { name: 'Azure SQL (ACID)', status: 'Connected', icon: Database, color: 'text-brand-mint' },
    { name: 'Azure Blob Storage', status: 'Encrypted', icon: Server, color: 'text-brand-cyan' },
    { name: 'Azure Key Vault', status: 'Locked', icon: Key, color: 'text-purple-400' },
];

const AUDIT_LOGS = [
    { action: 'Auto-Approval: Vendor Payment (Slack)', amount: '$4,200', risk: 'Low', time: '10 mins ago', by: 'Decision Agent' },
    { action: 'Flagged: Duplicate Invoice Detected', amount: '$15,000', risk: 'High', time: '1 hr ago', by: 'Insight Agent' },
    { action: 'Reconciliation: Stripe to Ledger', amount: '-', risk: 'Low', time: '3 hrs ago', by: 'Reconciliation Agent' },
    { action: 'Policy Override: Extend Runway', amount: '-', risk: 'Medium', time: '1 day ago', by: 'Admin (Human)' },
];

export default function GovernancePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Governance & Architecture</h1>
                    <p className="text-gray-400 text-sm mt-1">Enterprise-grade security integrations and audit logs.</p>
                </div>
                <div className="flex items-center space-x-2 text-brand-mint bg-brand-mint/10 px-3 py-1.5 rounded-lg border border-brand-mint/20">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-semibold">SOC2 Compliant</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Architecture Specs */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <Server className="w-5 h-5 mr-2 text-brand-cyan" />
                        Azure Infrastructure Status
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {INFRASTRUCTURE.map(item => (
                            <div key={item.name} className="bg-[#1a1d27] border border-[#ffffff10] rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                    <span className="flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand-mint opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">{item.status}</div>
                                    <div className="text-sm font-semibold text-white">{item.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Human-in-the-Loop Policies */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-brand-mint" />
                        Approval Gates (Human-in-the-Loop)
                    </h2>
                    <div className="space-y-4">
                        {[
                            { rule: 'Auto-approve payouts under', val: '$10,000', active: true },
                            { rule: 'Require dual-approval for', val: '>$50,000', active: true },
                            { rule: 'Halt on burn rate variance >', val: '15%', active: false }
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#1a1d27] p-4 rounded-xl border border-[#ffffff10]">
                                <span className="text-gray-300 text-sm">{rule.rule} <strong className="text-white">{rule.val}</strong></span>
                                <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${rule.active ? 'bg-brand-mint' : 'bg-gray-600'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${rule.active ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Immutable Audit Log */}
                <div className="col-span-1 lg:col-span-2 glass-panel p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                        Immutable Audit Trail
                    </h2>
                    <div className="border border-[#ffffff10] rounded-xl overflow-hidden bg-[#1a1d27]">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black/20 text-gray-300 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Action</th>
                                    <th className="px-6 py-3">Agent/User</th>
                                    <th className="px-6 py-3">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ffffff10]">
                                {AUDIT_LOGS.map((log, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">{log.time}</td>
                                        <td className="px-6 py-4 font-medium text-gray-200">{log.action}</td>
                                        <td className="px-6 py-4">{log.by}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 flex items-center w-fit text-xs font-semibold rounded-md ${log.risk === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                    log.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                        'bg-brand-mint/10 text-brand-mint border border-brand-mint/20'
                                                }`}>
                                                {log.risk}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
