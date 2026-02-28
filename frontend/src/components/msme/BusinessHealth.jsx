import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Shield, Loader2, AlertTriangle, CheckCircle, BarChart2, Percent, Users, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loadCSV } from '../../utils/csvParser';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function BusinessHealth() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [sectorPeers, setSectorPeers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const predictions = await loadCSV('/data/msme_predictions.csv');
            const mine = predictions.find(m => m.MSME_ID === user.msmeId);
            setProfile(mine);
            if (mine) {
                const peers = predictions.filter(m => m.Sector === mine.Sector && m.MSME_ID !== mine.MSME_ID);
                setSectorPeers(peers);
            }
            setLoading(false);
        }
        fetchData();
    }, [user.msmeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Analysing your business health...</span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-12 text-center rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}>
                <p style={{ color: 'var(--color-foreground-muted)' }}>No profile found for {user.msmeId}</p>
            </div>
        );
    }

    // Derived health metrics (0-100 scale)
    const gstScore = Math.min(100, Number(profile.GST_Compliance_Score));
    const inspectionScore = Math.min(100, Number(profile.Inspection_Score));
    const docScore = Math.min(100, Number(profile.Documentation_Readiness_Score));
    const capacityUtil = Math.min(100, Number(profile.Capacity_Utilization));
    const profitMargin = Math.min(100, Number(profile.Profit_Margin) * 100);
    const growthRate = Math.max(0, Math.min(100, (Number(profile.Revenue_Growth_Rate) + 0.5) * 100));
    const debtRatio = Math.max(0, 100 - Number(profile.Loan_to_Revenue_Ratio) * 100);
    const techLevel = Math.min(100, Number(profile.Technology_Level) * 20);

    const overallHealth = Math.round(
        (gstScore * 0.15 + inspectionScore * 0.1 + docScore * 0.1 + capacityUtil * 0.15 + profitMargin * 0.2 + growthRate * 0.1 + debtRatio * 0.1 + techLevel * 0.1)
    );

    const healthColor = overallHealth >= 70 ? 'var(--color-success)' : overallHealth >= 45 ? 'var(--color-warning)' : 'var(--color-destructive)';
    const healthLabel = overallHealth >= 70 ? 'Healthy' : overallHealth >= 45 ? 'Moderate' : 'Needs Attention';

    // Sector peer comparison
    const avgPeerRevenue = sectorPeers.length > 0
        ? sectorPeers.reduce((s, p) => s + Number(p.Annual_Revenue), 0) / sectorPeers.length
        : Number(profile.Annual_Revenue);
    const avgPeerEmployees = sectorPeers.length > 0
        ? sectorPeers.reduce((s, p) => s + Number(p.Number_of_Employees), 0) / sectorPeers.length
        : Number(profile.Number_of_Employees);
    const avgPeerGrowthScore = sectorPeers.length > 0
        ? sectorPeers.reduce((s, p) => s + Number(p.Growth_Score), 0) / sectorPeers.length
        : Number(profile.Growth_Score);

    const radarData = [
        { metric: 'GST Compliance', value: Math.round(gstScore), fullMark: 100 },
        { metric: 'Inspection', value: Math.round(inspectionScore), fullMark: 100 },
        { metric: 'Documentation', value: Math.round(docScore), fullMark: 100 },
        { metric: 'Capacity Use', value: Math.round(capacityUtil), fullMark: 100 },
        { metric: 'Tech Level', value: Math.round(techLevel), fullMark: 100 },
        { metric: 'Debt Health', value: Math.round(debtRatio), fullMark: 100 },
    ];

    const peerCompData = [
        { name: 'Your Revenue', value: Math.round(Number(profile.Annual_Revenue) / 100000), fill: 'var(--color-primary)' },
        { name: 'Sector Avg', value: Math.round(avgPeerRevenue / 100000), fill: 'var(--color-background-muted)' },
    ];

    const metrics = [
        {
            label: 'Annual Revenue',
            value: `₹${(Number(profile.Annual_Revenue) / 10000000).toFixed(2)} Cr`,
            icon: IndianRupee,
            color: 'var(--color-warning)',
            bg: 'var(--color-warning-muted)',
            trend: Number(profile.Revenue_Growth_Rate) > 0 ? 'up' : 'down',
            trendVal: `${(Number(profile.Revenue_Growth_Rate) * 100).toFixed(1)}%`
        },
        {
            label: 'Profit Margin',
            value: `${(Number(profile.Profit_Margin) * 100).toFixed(1)}%`,
            icon: Percent,
            color: 'var(--color-success)',
            bg: 'var(--color-success-muted)',
            trend: Number(profile.Profit_Margin) > 0.1 ? 'up' : 'down',
            trendVal: Number(profile.Profit_Margin) > 0.1 ? 'Above avg' : 'Below avg'
        },
        {
            label: 'Employees',
            value: profile.Number_of_Employees,
            icon: Users,
            color: 'var(--color-primary)',
            bg: 'var(--color-primary-muted)',
            trend: Number(profile.Number_of_Employees) >= avgPeerEmployees ? 'up' : 'down',
            trendVal: `Sector avg: ${Math.round(avgPeerEmployees)}`
        },
        {
            label: 'Capacity Utilization',
            value: `${Number(profile.Capacity_Utilization).toFixed(1)}%`,
            icon: Activity,
            color: capacityUtil >= 70 ? 'var(--color-success)' : 'var(--color-warning)',
            bg: capacityUtil >= 70 ? 'var(--color-success-muted)' : 'var(--color-warning-muted)',
            trend: capacityUtil >= 70 ? 'up' : 'down',
            trendVal: capacityUtil >= 70 ? 'Optimal' : 'Under-utilized'
        },
    ];

    const complianceItems = [
        { label: 'GST Compliance', score: gstScore, threshold: 75 },
        { label: 'Inspection Score', score: inspectionScore, threshold: 70 },
        { label: 'Documentation Readiness', score: docScore, threshold: 65 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ backgroundColor: 'var(--color-success-muted)', color: 'var(--color-success)', border: '1px solid rgba(20,184,166,0.2)' }}
                >
                    Business Health
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">Business Health Report</h1>
                <p style={{ color: 'var(--color-foreground-muted)' }}>
                    A detailed assessment of {user.msmeId}'s operational and financial health
                </p>
            </div>

            {/* Overall Health Score */}
            <div
                className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                style={{ backgroundColor: 'var(--color-background-elevated)', border: `1px solid ${healthColor}` }}
            >
                <div>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-foreground-subtle)' }}>Overall Health Score</p>
                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-bold" style={{ color: healthColor }}>{overallHealth}</span>
                        <span className="text-lg mb-1" style={{ color: 'var(--color-foreground-muted)' }}>/100</span>
                    </div>
                    <span
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: healthColor + '22', color: healthColor }}
                    >
                        {overallHealth >= 70 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {healthLabel}
                    </span>
                </div>
                <div className="flex gap-6 text-sm">
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Sector</p>
                        <p className="font-semibold">{profile.Sector}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Category</p>
                        <p className="font-semibold">{profile.Category}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Peers in Sector</p>
                        <p className="font-semibold">{sectorPeers.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Sector Avg Score</p>
                        <p className="font-semibold">{Math.round(avgPeerGrowthScore)}</p>
                    </div>
                </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className="p-5 rounded-xl"
                        style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: m.bg }}>
                                <m.icon className="w-4 h-4" style={{ color: m.color }} />
                            </div>
                            <span className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>{m.label}</span>
                        </div>
                        <p className="text-2xl font-bold mb-1">{m.value}</p>
                        <div className="flex items-center gap-1 text-xs" style={{ color: m.trend === 'up' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                            {m.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {m.trendVal}
                        </div>
                    </div>
                ))}
            </div>

            {/* Radar + Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div
                    className="p-6 rounded-xl"
                    style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        <h3 className="font-semibold">Health Radar</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="var(--color-border)" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--color-foreground-muted)', fontSize: 11 }} />
                            <Radar name="Health" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Compliance Scores */}
                <div
                    className="p-6 rounded-xl"
                    style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                        <h3 className="font-semibold">Compliance & Readiness</h3>
                    </div>
                    <div className="space-y-5">
                        {complianceItems.map((item) => {
                            const pct = Math.round(item.score);
                            const isGood = item.score >= item.threshold;
                            const color = isGood ? 'var(--color-success)' : 'var(--color-warning)';
                            return (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span style={{ color: 'var(--color-foreground-muted)' }}>{item.label}</span>
                                        <div className="flex items-center gap-2">
                                            {isGood
                                                ? <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                                                : <AlertTriangle className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                                            }
                                            <span className="font-semibold" style={{ color }}>{pct.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-background-muted)' }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%`, backgroundColor: color }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <h4 className="text-sm font-semibold mb-3">Key Recommendations</h4>
                        <ul className="space-y-2 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                            {docScore < 65 && (
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />
                                    Improve documentation readiness to qualify for more schemes
                                </li>
                            )}
                            {capacityUtil < 60 && (
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />
                                    Capacity utilization is low — consider technology upgrade schemes
                                </li>
                            )}
                            {Number(profile.Loan_to_Revenue_Ratio) > 0.5 && (
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />
                                    High debt ratio may affect loan eligibility — explore subsidy schemes first
                                </li>
                            )}
                            {overallHealth >= 70 && (
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                                    Your business is in strong health — apply for high-value schemes now
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Peer Comparison Bar Chart */}
            <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}
            >
                <h3 className="font-semibold mb-6">Revenue vs. Sector Average (in ₹ Lakhs)</h3>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={peerCompData} layout="vertical" barSize={28}>
                        <XAxis type="number" tick={{ fill: 'var(--color-foreground-subtle)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-foreground-muted)', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                        <Tooltip
                            formatter={(val) => [`₹${val}L`, 'Revenue']}
                            contentStyle={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'white' }}
                        />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {peerCompData.map((entry, idx) => (
                                <Cell key={idx} fill={idx === 0 ? '#3b82f6' : '#3f3f46'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
