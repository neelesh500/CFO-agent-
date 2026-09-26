"use client";
import { useEffect, useState } from 'react';
import { Database, CreditCard, Users, Edit } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const backend_url = "http://127.0.0.1:8000";

export default function DataControlPage() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [salaries, setSalaries] = useState<any[]>([]);

    useEffect(() => {
        if (!user || user.role !== 'CFO_ADMIN') return;
        fetch(`${backend_url}/api/payments`, { headers: { 'Authorization': `Bearer ${user.token}` } })
            .then(res => res.json()).then(setPayments);
        fetch(`${backend_url}/api/salaries`, { headers: { 'Authorization': `Bearer ${user.token}` } })
            .then(res => res.json()).then(setSalaries);
    }, [user]);

    const updatePayment = async (id: number, status: string) => {
        await fetch(`${backend_url}/api/payments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
            body: JSON.stringify({ status })
        });
        const res = await fetch(`${backend_url}/api/payments`, { headers: { 'Authorization': `Bearer ${user?.token}` } });
        setPayments(await res.json());
    };

    if (user?.role !== 'CFO_ADMIN') {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="panel p-6 rounded-xl border-red-500/30 text-center">
                    <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
                    <p className="text-gray-400 mt-2">Your current role does not permit access to database operations.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#ffffff1a]">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center">
                    <Database className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Data Control Center</h1>
                    <p className="text-gray-400 text-sm">Directly manage Payments and Salaries Databases</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payments Table */}
                <div className="panel p-6 rounded-xl">
                    <h2 className="text-lg font-bold flex items-center mb-4"><CreditCard className="w-5 h-5 mr-2 text-blue-400" /> Payment Database</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400 border-b border-[#ffffff1a]">
                                <tr>
                                    <th className="pb-3">ID</th>
                                    <th className="pb-3">Recipient</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id} className="border-b border-[#ffffff0a]">
                                        <td className="py-3">{p.id}</td>
                                        <td className="py-3 font-medium">{p.recipient}</td>
                                        <td className="py-3">${p.amount}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${p.status === 'Paid' ? 'bg-green-500/20 text-green-400' : p.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-3 hidden lg:block">
                                            <select
                                                className="bg-[#181a1f] border border-[#ffffff1a] text-xs rounded px-2 py-1 text-white"
                                                value={p.status}
                                                onChange={(e) => updatePayment(p.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Halted">Halted</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Salaries Table */}
                <div className="panel p-6 rounded-xl">
                    <h2 className="text-lg font-bold flex items-center mb-4"><Users className="w-5 h-5 mr-2 text-green-400" /> Salary Database</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400 border-b border-[#ffffff1a]">
                                <tr>
                                    <th className="pb-3">ID</th>
                                    <th className="pb-3">Employee</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map(s => (
                                    <tr key={s.id} className="border-b border-[#ffffff0a]">
                                        <td className="py-3">{s.id}</td>
                                        <td className="py-3 font-medium">{s.employee}</td>
                                        <td className="py-3">${s.amount}</td>
                                        <td className="py-3">{s.date}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${s.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {s.status}
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

// Layout optimized for mobile responsiveness

