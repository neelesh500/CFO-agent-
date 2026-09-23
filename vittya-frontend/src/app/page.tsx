"use client";

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Wallet, Flame, TrendingUp, Zap, Sparkles } from 'lucide-react';

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
        // Don't throw, just let it fail silently in UI
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time CFO intelligence powered by multi-agent analysis.</p>
        </div>
        <div className="bg-brand-cyan/10 border border-brand-cyan/20 px-4 py-2 rounded-lg flex items-center space-x-2 text-brand-cyan">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold">Insight: Cash runway extended by 2.4 months</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Liquidity", value: metrics.total_liquidity, icon: Wallet, color: "text-brand-cyan", bg: "bg-brand-cyan/10" },
          { label: "Burn Rate", value: metrics.burn_rate, icon: Flame, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Q2 Revenue", value: metrics.q2_revenue, icon: TrendingUp, color: "text-brand-mint", bg: "bg-brand-mint/10" },
          { label: "Agents Executed", value: metrics.actions_executed, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" }
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-[#ffffff20] transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.bg} rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#1a1d27] p-2.5 rounded-lg border border-[#ffffff10]">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{kpi.value || "Loading..."}</div>
            <div className="text-sm text-gray-400 font-medium">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Cash Flow & Forecast</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12141c', borderColor: '#ffffff1a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Expense Breakdown</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: 'Payroll', value: 850 },
                { category: 'Cloud', value: 240 },
                { category: 'Marketing', value: 160 },
                { category: 'Legal', value: 80 }
              ]} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#ffffff0a' }}
                  contentStyle={{ backgroundColor: '#12141c', border: '1px solid #ffffff1a', borderRadius: '8px' }}
                  formatter={(val) => [`$${val}k`, 'Amount']}
                />
                <Bar dataKey="value" fill="#00F2FE" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
