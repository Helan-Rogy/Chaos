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
        <div className="space-y-8 animate-fade-in">
            {/* Header & Controls */}
            <div className="card">
                <div className="px-6 py-5 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-muted rounded-lg">
                            <Settings2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Policy Optimization Engine</h2>
                            <p className="text-sm text-foreground-muted">Simulate strategic budget allocation with adjustable priority weights.</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchSimulation}
                        disabled={loading}
                        className="btn-primary min-w-[160px]"
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
                            <label className="text-sm font-medium text-foreground-muted">Total Budget</label>
                            <span className="text-xl font-bold text-foreground">{formatCurrency(budget)}</span>
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
                        <div className="flex justify-between text-xs text-foreground-subtle">
                            <span>1 Cr</span>
                            <span>20 Cr</span>
                        </div>
                    </div>

                    {/* Priority Slider */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground-muted">Economic Priority Focus</label>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={alpha}
                            onChange={handleSliderChange}
                            className="w-full"
                        />
                        <div className="flex justify-between items-center p-3 bg-background-subtle rounded-lg border border-border">
                            <div className={`transition-all ${beta > 0.5 ? 'opacity-100' : 'opacity-40'}`}>
                                <span className="text-xs text-foreground-subtle">Employment</span>
                                <p className={`text-sm font-semibold ${beta > 0.5 ? 'text-success' : 'text-foreground-muted'}`}>
                                    {(beta * 100).toFixed(0)}%
                                </p>
                            </div>
                            <div className="h-6 w-px bg-border" />
                            <div className={`text-right transition-all ${alpha > 0.5 ? 'opacity-100' : 'opacity-40'}`}>
                                <span className="text-xs text-foreground-subtle">Revenue</span>
                                <p className={`text-sm font-semibold ${alpha > 0.5 ? 'text-primary' : 'text-foreground-muted'}`}>
                                    {(alpha * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-destructive-muted border border-destructive/20 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">
                        <strong>Error:</strong> {error}
                    </p>
                </div>
            )}

            {/* Results */}
            {data && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KPI Cards */}
                    <div className="space-y-4">
                        <div className="metric-card border-l-4 border-l-primary">
                            <div className="flex items-center gap-2">
                                <Percent className="w-4 h-4 text-primary" />
                                <span className="metric-label">Budget Utilization</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-foreground">{data.utilization_pct.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-background-muted h-1.5 rounded-full mt-2">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-700"
                                    style={{ width: `${data.utilization_pct}%` }}
                                />
                            </div>
                        </div>

                        <div className="metric-card border-l-4 border-l-success">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-success" />
                                <span className="metric-label">MSMEs Selected</span>
                            </div>
                            <span className="text-3xl font-bold text-foreground">{data.total_selected}</span>
                            <p className="text-xs text-foreground-subtle mt-1">Approved for disbursement</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="metric-card">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Users className="w-3.5 h-3.5 text-success" />
                                    <span className="metric-label text-[10px]">Jobs Created</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">+{Math.round(data.total_jobs_created)}</span>
                            </div>
                            <div className="metric-card">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <DollarSign className="w-3.5 h-3.5 text-warning" />
                                    <span className="metric-label text-[10px]">Revenue Gain</span>
                                </div>
                                <span className="text-lg font-bold text-warning">{formatCurrency(data.total_revenue_gain)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-foreground">Sectoral Budget Distribution</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
                                <span className="text-xs text-foreground-subtle">Live</span>
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
                                <CheckCircle className="w-5 h-5 text-success" />
                                <h3 className="text-lg font-semibold text-foreground">Approved Allocations</h3>
                            </div>
                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto max-h-[400px]">
                                    <table className="min-w-full">
                                        <thead className="bg-background-subtle sticky top-0">
                                            <tr>
                                                <th className="table-header">Rank</th>
                                                <th className="table-header">Entity & Scheme</th>
                                                <th className="table-header">Amount</th>
                                                <th className="table-header">Justification</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.selected.map((row, i) => (
                                                <tr key={i} className="table-row">
                                                    <td className="table-cell">
                                                        <span className="text-xs font-semibold text-warning">#{row.Selection_Rank}</span>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="font-medium text-foreground">{row.MSME_ID}</div>
                                                        <div className="text-xs text-foreground-subtle mt-0.5">{row.Scheme_Name}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className="font-semibold text-success">{formatCurrency(row.Subsidy_Applied)}</span>
                                                    </td>
                                                    <td className="table-cell">
                                                        <p className="text-xs text-foreground-muted leading-relaxed max-w-lg">
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
                                <XCircle className="w-5 h-5 text-destructive" />
                                <h3 className="text-lg font-semibold text-foreground">Budget Exclusions</h3>
                            </div>
                            <div className="card overflow-hidden opacity-80">
                                <div className="overflow-x-auto max-h-64">
                                    <table className="min-w-full">
                                        <thead className="bg-background-subtle sticky top-0">
                                            <tr>
                                                <th className="table-header">Entity</th>
                                                <th className="table-header">Scheme</th>
                                                <th className="table-header">Efficiency</th>
                                                <th className="table-header">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.unselected && data.unselected.length > 0 ? data.unselected.map((row, i) => (
                                                <tr key={i} className="table-row hover:bg-destructive-muted/30">
                                                    <td className="table-cell font-medium text-foreground/70">{row.MSME_ID}</td>
                                                    <td className="table-cell text-xs text-foreground-subtle">{row.Scheme_Name}</td>
                                                    <td className="table-cell font-mono text-xs text-foreground-subtle">{row.Efficiency.toFixed(4)}</td>
                                                    <td className="table-cell">
                                                        <span className="text-xs font-medium text-destructive">{row.Reason}</span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="table-cell text-center py-8 text-foreground-muted">
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
