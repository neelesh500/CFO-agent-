"use client";

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Wallet, Flame, TrendingUp, Zap, Info } from 'lucide-react';

const cashFlowData = [
  { month: 'Jan', revenue: 1.2, expenses: 1.0 },
  { month: 'Feb', revenue: 1.4, expenses: 1.1 },
  { month: 'Mar', revenue: 1.7, expenses: 1.15 },
  { month: 'Apr', revenue: 1.5, expenses: 1.2 },
  { month: 'May', revenue: 2.0, expenses: 1.3 },
  { month: 'Jun', revenue: 2.15, expenses: 1.35 },
];

const backend_url = "http://127.0.0.1:8000";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    total_liquidity: "$0",
    burn_rate: "$0 / mo",
    q2_revenue: "$0",
    actions_executed: "0"
  });

  useEffect(() => {
    fetch(`${backend_url}/api/dashboard/metrics`)
      .then(res => {
        if (!res.ok) throw new Error("Backend response not OK");
        return res.json();
      })
      .then(data => setMetrics(data))
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Financial Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time CFO intelligence and metrics.</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-md flex items-center space-x-2 text-blue-400">
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">Insight: Cash runway extended by 2.4 months</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Liquidity", value: metrics.total_liquidity, icon: Wallet, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Burn Rate", value: metrics.burn_rate, icon: Flame, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Q2 Revenue", value: metrics.q2_revenue, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Agents Executed", value: metrics.actions_executed, icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" }
        ].map((kpi, i) => (
          <div key={i} className="panel p-5 rounded-xl border border-[#ffffff0a]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-md ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-2xl font-semibold mb-1 tracking-tight">{kpi.value || "Loading..."}</div>
            <div className="text-sm text-gray-400 font-medium">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 panel p-6 rounded-xl border border-[#ffffff0a]">
          <h2 className="text-base font-semibold mb-6 flex items-center">Cash Flow & Forecast</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181a1f', borderColor: '#ffffff1a', borderRadius: '6px', fontSize: '13px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-6 rounded-xl border border-[#ffffff0a]">
          <h2 className="text-base font-semibold mb-6">Expense Breakdown & Analysis</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: 'Payroll', value: 850 },
                { category: 'Cloud', value: 240 },
                { category: 'Marketing', value: 160 },
                { category: 'Legal', value: 80 }
              ]} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#ffffff0a' }}
                  contentStyle={{ backgroundColor: '#181a1f', border: '1px solid #ffffff1a', borderRadius: '6px', fontSize: '13px' }}
                  formatter={(val) => [`$${val}k`, 'Amount']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
