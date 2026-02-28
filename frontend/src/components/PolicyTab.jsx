import React, { useState, useMemo, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Settings2, CheckCircle, XCircle, TrendingUp, Users, DollarSign, Percent, Loader2, RefreshCw } from 'lucide-react';
import { loadCSV } from '../utils/csvParser';

export default function PolicyTab() {
    const [budget, setBudget] = useState(50000000);
    const [alpha, setAlpha] = useState(0.6);
    const [predictions, setPredictions] = useState([]);
    const [eligibility, setEligibility] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [pred, elig] = await Promise.all([
                loadCSV('/data/msme_predictions.csv'),
                loadCSV('/data/scheme_eligibility_results.csv')
            ]);
            setPredictions(pred);
            setEligibility(elig);
            setLoading(false);
        }
        fetchData();
    }, []);

    const beta = Math.round((1 - alpha) * 10) / 10;

    const handleSliderChange = (e) => setAlpha(parseFloat(e.target.value));
    const fetchSimulation = () => {}; // simulation runs reactively via useMemo

    // Calculate optimization results based on actual data
    const data = useMemo(() => {
        if (predictions.length === 0 || eligibility.length === 0) {
            return { selected: [], rejected: [], total_selected: 0, total_rejected: 0, utilization_pct: 0, total_revenue_gain: 0, total_jobs_created: 0, budget_used: 0 };
        }

        // Create a map of MSME details
        const msmeMap = {};
        predictions.forEach(p => {
            msmeMap[p.MSME_ID] = p;
        });

        // Score each eligibility record based on alpha (revenue) and beta (jobs)
        const scored = eligibility.map(e => {
            const msme = msmeMap[e.MSME_ID] || {};
            const revenueScore = Number(e.Revenue_Increase_Pct) || 0;
            const jobScore = Number(e.New_Jobs_Added) || 0;
            const compositeScore = (alpha * revenueScore) + ((1 - alpha) * jobScore * 10);
            return {
                ...e,
                Sector: msme.Sector || 'Unknown',
                compositeScore,
                Subsidy_Applied: Number(e.Subsidy_Applied) || Number(e.Max_Subsidy_Amount) || 0
            };
        });

        // Sort by composite score and select within budget
        scored.sort((a, b) => b.compositeScore - a.compositeScore);

        let remainingBudget = budget;
        const selected = [];
        const rejected = [];

        scored.forEach((item, idx) => {
            if (remainingBudget >= item.Subsidy_Applied && selected.length < 50) {
                remainingBudget -= item.Subsidy_Applied;
                selected.push({
                    MSME_ID: item.MSME_ID,
                    Sector: item.Sector,
                    Scheme_Name: item.Scheme_Name,
                    Subsidy_Applied: item.Subsidy_Applied,
                    Selection_Rank: selected.length + 1,
                    Revenue_Boost: Number(item.Revenue_Increase_Pct) || 0,
                    Jobs_Created: Number(item.New_Jobs_Added) || 0,
                    Justification: `Composite score: ${item.compositeScore.toFixed(1)} | ${item.Predicted_Growth_Category || 'Growth'} potential`
                });
            } else if (rejected.length < 20) {
                rejected.push({
                    MSME_ID: item.MSME_ID,
                    Sector: item.Sector,
                    Scheme_Name: item.Scheme_Name,
                    Rejection_Reason: remainingBudget < item.Subsidy_Applied 
                        ? 'Insufficient budget remaining'
                        : 'Lower priority score in current allocation'
                });
            }
        });

        const totalSubsidy = selected.reduce((sum, row) => sum + row.Subsidy_Applied, 0);
        const totalRevenueGain = selected.reduce((sum, row) => sum + (row.Subsidy_Applied * row.Revenue_Boost / 100), 0);
        const totalJobs = selected.reduce((sum, row) => sum + row.Jobs_Created, 0);

        return {
            selected,
            rejected,
            total_selected: selected.length,
            total_rejected: rejected.length,
            utilization_pct: Math.min((totalSubsidy / budget) * 100, 100),
            total_revenue_gain: totalRevenueGain,
            total_jobs_created: totalJobs,
            budget_used: totalSubsidy
        };
    }, [predictions, eligibility, budget, alpha]);

    const chartData = useMemo(() => {
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
    }, [data.selected]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading policy data...</span>
            </div>
        );
    }

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
                            <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                                Simulate strategic budget allocation across {eligibility.length} eligible scheme applications.
                            </p>
                        </div>
                    </div>
                    <div 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: 'var(--color-success-muted)' }}
                    >
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>Live Simulation</span>
                    </div>
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
                            max="500000000"
                            step="5000000"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                            <span>₹1 Cr</span>
                            <span>₹50 Cr</span>
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
                            className="w-full accent-blue-500"
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

                <div className="px-6 pb-5">
                    <button
                        onClick={fetchSimulation}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white'
                        }}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Re-run Optimization
                    </button>
                </div>
            </div>

            {/* Results */}
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
                            <span className="text-xl font-bold">+{data.total_jobs_created}</span>
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
                            <h3 className="text-lg font-semibold">Approved Allocations ({data.total_selected})</h3>
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
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.selected.map((row, i) => (
                                            <tr 
                                                key={i} 
                                                className="transition-colors hover:bg-white/5"
                                                style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                            >
                                                <td className="px-4 py-3">
                                                    <span 
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                                        style={{
                                                            backgroundColor: i < 3 ? 'var(--color-primary)' : 'var(--color-background-muted)',
                                                            color: i < 3 ? 'white' : 'var(--color-foreground-muted)'
                                                        }}
                                                    >
                                                        {row.Selection_Rank}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-semibold text-sm">{row.MSME_ID}</p>
                                                        <p className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>{row.Scheme_Name}</p>
                                                        <span 
                                                            className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px]"
                                                            style={{ backgroundColor: 'var(--color-background-muted)' }}
                                                        >
                                                            {row.Sector}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                        {formatCurrency(row.Subsidy_Applied)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-3 text-xs">
                                                        <span style={{ color: 'var(--color-success)' }}>+{row.Revenue_Boost.toFixed(1)}% Rev</span>
                                                        <span style={{ color: 'var(--color-primary)' }}>+{row.Jobs_Created} Jobs</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Rejected */}
                    {data.rejected.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <XCircle className="w-5 h-5" style={{ color: 'var(--color-error)' }} />
                                <h3 className="text-lg font-semibold">Not Approved ({data.total_rejected})</h3>
                            </div>
                            <div 
                                className="rounded-xl overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div className="overflow-x-auto max-h-[250px]">
                                    <table className="min-w-full">
                                        <thead 
                                            className="sticky top-0"
                                            style={{ backgroundColor: 'var(--color-background-subtle)' }}
                                        >
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Entity & Scheme</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.rejected.map((row, i) => (
                                                <tr 
                                                    key={i} 
                                                    className="transition-colors hover:bg-white/5"
                                                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="font-semibold text-sm">{row.MSME_ID}</p>
                                                            <p className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>{row.Scheme_Name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs" style={{ color: 'var(--color-error)' }}>{row.Rejection_Reason}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
