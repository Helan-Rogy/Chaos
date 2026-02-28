import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Settings2, AlertTriangle, CheckCircle, XCircle, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';

export default function PolicyTab() {
    const [budget, setBudget] = useState(50000000);
    const [alpha, setAlpha] = useState(0.6);

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
        <div className="space-y-8">
            {/* Header & Controls */}
            <div 
                className="rounded-xl"
                style={{
                    backgroundColor: 'var(--color-background-elevated)',
                    border: '1px solid var(--color-border)'
                }}
            >
                <div 
                    className="px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-3">
                        <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-primary-muted)' }}
                        >
                            <Settings2 className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Policy Optimization Engine</h2>
                            <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>Simulate strategic budget allocation with adjustable priority weights.</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchSimulation}
                        disabled={loading}
                        className="min-w-[160px] px-5 py-2.5 rounded-lg font-medium transition-all"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Running...
                            </div>
                        ) : 'Run Simulation'}
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Budget Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground-muted)' }}>Total Budget</label>
                            <span className="text-xl font-bold">{formatCurrency(budget)}</span>
                        </div>
                        <input
                            type="range"
                            min="10000000"
                            max="200000000"
                            step="5000000"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                            <span>1 Cr</span>
                            <span>20 Cr</span>
                        </div>
                    </div>

                    {/* Priority Slider */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-foreground-muted)' }}>Economic Priority Focus</label>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={alpha}
                            onChange={handleSliderChange}
                            className="w-full"
                        />
                        <div 
                            className="flex justify-between items-center p-3 rounded-lg"
                            style={{
                                backgroundColor: 'var(--color-background-subtle)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <div style={{ opacity: beta > 0.5 ? 1 : 0.4 }}>
                                <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Employment</span>
                                <p 
                                    className="text-sm font-semibold"
                                    style={{ color: beta > 0.5 ? 'var(--color-success)' : 'var(--color-foreground-muted)' }}
                                >
                                    {(beta * 100).toFixed(0)}%
                                </p>
                            </div>
                            <div className="h-6 w-px" style={{ backgroundColor: 'var(--color-border)' }} />
                            <div className="text-right" style={{ opacity: alpha > 0.5 ? 1 : 0.4 }}>
                                <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue</span>
                                <p 
                                    className="text-sm font-semibold"
                                    style={{ color: alpha > 0.5 ? 'var(--color-primary)' : 'var(--color-foreground-muted)' }}
                                >
                                    {(alpha * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div 
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-destructive-muted)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                >
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--color-destructive)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-destructive)' }}>
                        <strong>Error:</strong> {error}
                    </p>
                </div>
            )}

            {/* Results */}
            {data && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KPI Cards */}
                    <div className="space-y-4">
                        <div 
                            className="p-5 rounded-xl"
                            style={{
                                backgroundColor: 'var(--color-background-elevated)',
                                border: '1px solid var(--color-border)',
                                borderLeft: '4px solid var(--color-primary)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Percent className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-foreground-subtle)' }}>Budget Utilization</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{data.utilization_pct.toFixed(1)}%</span>
                            </div>
                            <div 
                                className="w-full h-1.5 rounded-full mt-2"
                                style={{ backgroundColor: 'var(--color-background-muted)' }}
                            >
                                <div
                                    className="h-1.5 rounded-full transition-all duration-700"
                                    style={{ 
                                        width: `${data.utilization_pct}%`,
                                        backgroundColor: 'var(--color-primary)'
                                    }}
                                />
                            </div>
                        </div>

                        <div 
                            className="p-5 rounded-xl"
                            style={{
                                backgroundColor: 'var(--color-background-elevated)',
                                border: '1px solid var(--color-border)',
                                borderLeft: '4px solid var(--color-success)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-foreground-subtle)' }}>MSMEs Selected</span>
                            </div>
                            <span className="text-3xl font-bold">{data.total_selected}</span>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-foreground-subtle)' }}>Approved for disbursement</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div 
                                className="p-5 rounded-xl"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Users className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />
                                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-foreground-subtle)' }}>Jobs Created</span>
                                </div>
                                <span className="text-xl font-bold">+{Math.round(data.total_jobs_created)}</span>
                            </div>
                            <div 
                                className="p-5 rounded-xl"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <DollarSign className="w-3.5 h-3.5" style={{ color: 'var(--color-warning)' }} />
                                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue Gain</span>
                                </div>
                                <span className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{formatCurrency(data.total_revenue_gain)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div 
                        className="lg:col-span-2 p-6 rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold">Sectoral Budget Distribution</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
                                <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Live</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#71717a', fontSize: 11 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#71717a', fontSize: 11 }}
                                        tickFormatter={(value) => `${(value / 10000000).toFixed(1)}Cr`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        contentStyle={{
                                            backgroundColor: '#111111',
                                            borderRadius: '8px',
                                            border: '1px solid #27272a',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                                        }}
                                        labelStyle={{ color: '#fafafa', fontWeight: 600, marginBottom: '4px' }}
                                        itemStyle={{ color: '#a1a1aa', fontSize: '12px' }}
                                        formatter={(value) => [formatCurrency(value), 'Allocated']}
                                    />
                                    <Bar dataKey="Budget" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Selected */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                                <h3 className="text-lg font-semibold">Approved Allocations</h3>
                            </div>
                            <div 
                                className="rounded-xl overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div className="overflow-x-auto max-h-[400px]">
                                    <table className="min-w-full">
                                        <thead 
                                            className="sticky top-0"
                                            style={{ backgroundColor: 'var(--color-background-subtle)' }}
                                        >
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Rank</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Entity & Scheme</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Justification</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.selected.map((row, i) => (
                                                <tr 
                                                    key={i} 
                                                    className="transition-colors"
                                                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                                >
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="text-xs font-semibold" style={{ color: 'var(--color-warning)' }}>#{row.Selection_Rank}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="font-medium">{row.MSME_ID}</div>
                                                        <div className="text-xs mt-0.5" style={{ color: 'var(--color-foreground-subtle)' }}>{row.Scheme_Name}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(row.Subsidy_Applied)}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <p className="text-xs leading-relaxed max-w-lg" style={{ color: 'var(--color-foreground-muted)' }}>
                                                            {row.Decision_Justification}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Not Selected */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <XCircle className="w-5 h-5" style={{ color: 'var(--color-destructive)' }} />
                                <h3 className="text-lg font-semibold">Budget Exclusions</h3>
                            </div>
                            <div 
                                className="rounded-xl overflow-hidden opacity-80"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div className="overflow-x-auto max-h-64">
                                    <table className="min-w-full">
                                        <thead 
                                            className="sticky top-0"
                                            style={{ backgroundColor: 'var(--color-background-subtle)' }}
                                        >
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Entity</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Scheme</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Efficiency</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.unselected && data.unselected.length > 0 ? data.unselected.map((row, i) => (
                                                <tr 
                                                    key={i} 
                                                    className="transition-colors"
                                                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                                >
                                                    <td className="px-4 py-3 text-sm font-medium" style={{ opacity: 0.7 }}>{row.MSME_ID}</td>
                                                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>{row.Scheme_Name}</td>
                                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--color-foreground-subtle)' }}>{row.Efficiency.toFixed(4)}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="text-xs font-medium" style={{ color: 'var(--color-destructive)' }}>{row.Reason}</span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td 
                                                        colSpan="4" 
                                                        className="px-4 py-8 text-center text-sm"
                                                        style={{ color: 'var(--color-foreground-muted)' }}
                                                    >
                                                        Maximum efficiency achieved. All mandates satisfied.
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
