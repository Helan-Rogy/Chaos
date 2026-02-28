import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Settings2, AlertTriangle, Info, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function PolicyTab() {
    const [budget, setBudget] = useState(50000000); // 5 Cr
    const [alpha, setAlpha] = useState(0.6); // Revenue weight

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchSimulation = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/optimize', {
                budget,
                alpha
            });
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.details || err.message || "Failed to fetch simulation");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimulation();
        // eslint-disable-next-line
    }, []);

    const handleSliderChange = (e) => setAlpha(parseFloat(e.target.value));
    const beta = Math.round((1 - alpha) * 10) / 10;

    const getChartData = () => {
        if (!data || !data.selected) return [];
        const sectorMap = {};
        data.selected.forEach(row => {
            const s = row.Sector;
            if (!sectorMap[s]) sectorMap[s] = 0;
            sectorMap[s] += row.Subsidy_Applied;
        });
        return Object.keys(sectorMap).map(sector => ({
            name: sector,
            Budget: sectorMap[sector]
        })).sort((a, b) => b.Budget - a.Budget);
    };

    const chartData = getChartData();
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header & Controls Panel */}
            <div className="glass-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white flex items-center">
                            <div className="p-2 bg-artha-saffron/20 rounded-lg mr-3">
                                <Settings2 className="w-6 h-6 text-artha-saffron" />
                            </div>
                            Policy Optimization Engine
                        </h2>
                        <p className="mt-1 text-sm text-artha-slate">Simulate strategic allocation by shifting economic priority weights.</p>
                    </div>
                    <button
                        onClick={fetchSimulation}
                        disabled={loading}
                        className="premium-button min-w-[180px]"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-artha-navy border-t-transparent rounded-full"></div>
                                Calculating...
                            </div>
                        ) : 'Run Simulation'}
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Budget Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="block text-sm font-bold uppercase tracking-widest text-artha-slate">Total Budget Allocation</label>
                            <span className="text-2xl font-display font-bold accent-text-gold">{formatCurrency(budget)}</span>
                        </div>
                        <input
                            type="range"
                            min="10000000"
                            max="200000000"
                            step="5000000"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-artha-gold hover:accent-artha-saffron transition-all"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-artha-slate/50 uppercase tracking-tighter">
                            <span>₹1 Cr (Min)</span>
                            <span>₹20 Cr (Threshold)</span>
                        </div>
                    </div>

                    {/* Policy Weight Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="block text-sm font-bold uppercase tracking-widest text-artha-slate">Economic Priority Focus</label>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={alpha}
                            onChange={handleSliderChange}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-artha-saffron"
                        />
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className={`flex flex-col ${beta > 0.5 ? 'scale-110' : 'opacity-40'} transition-all duration-300`}>
                                <span className="text-[10px] font-bold text-artha-slate uppercase">Employment</span>
                                <span className={`text-sm font-bold ${beta > 0.5 ? 'text-white' : 'text-artha-slate'}`}>β: {beta}</span>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div className={`flex flex-col items-end ${alpha > 0.5 ? 'scale-110' : 'opacity-40'} transition-all duration-300`}>
                                <span className="text-[10px] font-bold text-artha-slate uppercase">Revenue Lift</span>
                                <span className={`text-sm font-bold ${alpha > 0.5 ? 'text-artha-saffron' : 'text-artha-slate'}`}>α: {alpha}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center animate-shake">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                    <p className="text-sm text-red-200 font-medium">
                        <strong>Engine Alert:</strong> {error}
                    </p>
                </div>
            )}

            {/* Results KPIs and Chart */}
            {data && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">

                    {/* KPIs Column */}
                    <div className="space-y-6">

                        <div className="glass-card p-6 border-l-4 border-l-artha-saffron relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                <TrendingUp className="w-12 h-12 text-artha-saffron" />
                            </div>
                            <p className="text-xs font-bold text-artha-slate uppercase tracking-widest mb-1">Budget Utilization</p>
                            <div className="flex items-baseline space-x-2">
                                <h3 className="text-4xl font-display font-bold text-white">{data.utilization_pct.toFixed(2)}%</h3>
                                <span className="text-xs text-artha-slate font-medium">Used</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 mt-4">
                                <div
                                    className="bg-gradient-to-r from-artha-gold to-artha-saffron h-1.5 rounded-full shadow-glow-saffron transition-all duration-1000"
                                    style={{ width: `${data.utilization_pct}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-l-artha-navy relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                <Info className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-xs font-bold text-artha-slate uppercase tracking-widest mb-1">MSME Reach</p>
                            <h3 className="text-4xl font-display font-bold text-artha-saffron">{data.total_selected}</h3>
                            <p className="text-[10px] text-artha-slate mt-2 uppercase tracking-tighter">Approved for Immediate Disbursement</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card p-5 text-center transition-transform hover:scale-105">
                                <p className="text-[10px] font-bold text-artha-slate uppercase mb-1">Impact (Jobs)</p>
                                <h3 className="text-2xl font-display font-bold text-white">+{Math.round(data.total_jobs_created)}</h3>
                            </div>
                            <div className="glass-card p-5 text-center transition-transform hover:scale-105 border border-artha-gold/20">
                                <p className="text-[10px] font-bold text-artha-slate uppercase mb-1">Impact (Revenue)</p>
                                <h3 className="text-xl font-display font-bold accent-text-gold">+{formatCurrency(data.total_revenue_gain).replace('₹', '₹')}</h3>
                            </div>
                        </div>

                    </div>

                    {/* Chart Column */}
                    <div className="lg:col-span-2 glass-card p-8 group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-display font-bold text-white tracking-wide">Sectoral Budget Distribution</h3>
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-artha-saffron animate-pulse"></div>
                                <span className="text-[10px] font-bold text-artha-slate uppercase">Live Matrix</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F4A300" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#C89B3C" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#5B6675', fontSize: 10, fontWeight: 600 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#5B6675', fontSize: 10, fontWeight: 600 }}
                                        tickFormatter={(value) => `₹${value / 10000000}Cr`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{
                                            backgroundColor: '#051226',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                        }}
                                        labelStyle={{ color: '#F4A300', fontWeight: 'bold', marginBottom: '4px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        formatter={(value) => [formatCurrency(value), 'Allocated']}
                                    />
                                    <Bar dataKey="Budget" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed Tables */}
                    <div className="lg:col-span-3 space-y-12 mt-6">

                        {/* Selected MSMEs Table */}
                        <div className="animate-fade-in delay-150">
                            <div className="flex items-center mb-6 px-2">
                                <div className="p-1.5 bg-emerald-500/20 rounded-md mr-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-white tracking-widest uppercase">Optimization Success Matrix</h3>
                            </div>
                            <div className="glass-card overflow-hidden">
                                <div className="overflow-x-auto max-h-[500px]">
                                    <table className="min-w-full divide-y divide-white/5">
                                        <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Rank</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Entity & Scheme</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Disbursement</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">AI Justification Strategy</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {data.selected.map((row, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-xs font-bold text-artha-gold group-hover:scale-110 transition-transform inline-block">#{row.Selection_Rank}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-white">{row.MSME_ID}</div>
                                                        <div className="text-[10px] text-artha-slate uppercase font-medium mt-0.5 tracking-tight">{row.Scheme_Name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-bold text-emerald-400">{formatCurrency(row.Subsidy_Applied)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-artha-ivory/80 leading-relaxed">
                                                        <div className="flex items-start max-w-2xl">
                                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-artha-saffron mr-3 flex-shrink-0"></div>
                                                            <span className="text-xs">{row.Decision_Justification}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Non-Selected MSMEs Table */}
                        <div className="animate-fade-in delay-300">
                            <div className="flex items-center mb-6 px-2">
                                <div className="p-1.5 bg-red-500/20 rounded-md mr-3">
                                    <XCircle className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-white tracking-widest uppercase">Budget Constraints & Exclusions</h3>
                            </div>
                            <div className="glass-card overflow-hidden opacity-90">
                                <div className="overflow-x-auto max-h-64">
                                    <table className="min-w-full divide-y divide-white/5">
                                        <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Entity</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Requested</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Eff. Score</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Exclusion Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.03]">
                                            {data.unselected && data.unselected.length > 0 ? data.unselected.map((row, i) => (
                                                <tr key={i} className="hover:bg-red-500/5 transition-colors">
                                                    <td className="px-6 py-3 text-sm font-medium text-white/70">{row.MSME_ID}</td>
                                                    <td className="px-6 py-3 text-[10px] text-artha-slate uppercase">{row.Scheme_Name}</td>
                                                    <td className="px-6 py-3 text-xs text-artha-slate font-mono">{row.Efficiency.toFixed(6)}</td>
                                                    <td className="px-6 py-3 text-sm text-red-400 font-bold uppercase text-[10px] tracking-widest">
                                                        {row.Reason}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-artha-slate font-medium">
                                                        Maximum efficiency achieved. All priority mandates satisfied by current budget.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
