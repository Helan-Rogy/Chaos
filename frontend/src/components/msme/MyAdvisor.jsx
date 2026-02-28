import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, IndianRupee, Users, Lightbulb, ChevronDown, ChevronUp, Loader2, Target, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loadCSV } from '../../utils/csvParser';

export default function MyAdvisor() {
    const { user } = useAuth();
    const [msmeProfile, setMsmeProfile] = useState(null);
    const [eligibleSchemes, setEligibleSchemes] = useState([]);
    const [allSchemes, setAllSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedScheme, setExpandedScheme] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [predictions, eligibility, schemes] = await Promise.all([
                loadCSV('/data/msme_predictions.csv'),
                loadCSV('/data/scheme_eligibility_results.csv'),
                loadCSV('/data/schemes_data.csv')
            ]);

            const profile = predictions.find(m => m.MSME_ID === user.msmeId);
            setMsmeProfile(profile);

            const myEligibility = eligibility.filter(e => e.MSME_ID === user.msmeId);
            const enriched = myEligibility.map(e => ({
                ...e,
                schemeDetails: schemes.find(s => s.Scheme_ID === e.Scheme_ID)
            })).sort((a, b) => Number(b.Revenue_Increase_Pct) - Number(a.Revenue_Increase_Pct));

            setEligibleSchemes(enriched);
            setAllSchemes(schemes);
            setLoading(false);
        }
        fetchData();
    }, [user.msmeId]);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const growthColor = (score) => {
        if (score > 70) return 'var(--color-success)';
        if (score > 40) return 'var(--color-warning)';
        return 'var(--color-foreground-subtle)';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading your advisory...</span>
            </div>
        );
    }

    if (!msmeProfile) {
        return (
            <div className="p-12 text-center rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}>
                <p style={{ color: 'var(--color-foreground-muted)' }}>No profile found for {user.msmeId}</p>
            </div>
        );
    }

    const growthScore = Number(msmeProfile.Growth_Score);
    const totalSubsidy = eligibleSchemes.reduce((s, e) => s + Number(e.Subsidy_Applied || 0), 0);
    const totalRevenueBoost = eligibleSchemes.length > 0
        ? eligibleSchemes.reduce((s, e) => s + Number(e.Revenue_Increase_Pct || 0), 0) / eligibleSchemes.length
        : 0;
    const totalJobs = eligibleSchemes.reduce((s, e) => s + Number(e.New_Jobs_Added || 0), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                    AI Advisory
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">Your Growth Advisory</h1>
                <p style={{ color: 'var(--color-foreground-muted)' }}>
                    Personalised scheme recommendations and growth insights for {user.msmeId}
                </p>
            </div>

            {/* Business Snapshot */}
            <div
                className="rounded-xl p-6"
                style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Your Business</p>
                        <h2 className="text-xl font-bold mb-2">{user.msmeId}</h2>
                        <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                            <span>{msmeProfile.Sector}</span>
                            <span style={{ color: 'var(--color-border)' }}>|</span>
                            <span>{msmeProfile.Category}</span>
                            <span style={{ color: 'var(--color-border)' }}>|</span>
                            <span>{msmeProfile.Location_Type}</span>
                            <span style={{ color: 'var(--color-border)' }}>|</span>
                            <span>{msmeProfile.Years_of_Operation} yrs operation</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>AI Growth Score</p>
                            <p className="text-4xl font-bold" style={{ color: growthColor(growthScore) }}>
                                {Math.round(growthScore)}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>out of 100</p>
                        </div>
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: `conic-gradient(${growthColor(growthScore)} ${growthScore * 3.6}deg, var(--color-background-muted) 0deg)`
                            }}
                        >
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'var(--color-background-elevated)' }}
                            >
                                <Target className="w-5 h-5" style={{ color: growthColor(growthScore) }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth category badge */}
                <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="flex flex-wrap gap-2">
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                            style={{
                                backgroundColor: msmeProfile.Predicted_Growth_Category === 'High' ? 'var(--color-success-muted)' : msmeProfile.Predicted_Growth_Category === 'Moderate' ? 'var(--color-warning-muted)' : 'var(--color-background-muted)',
                                color: msmeProfile.Predicted_Growth_Category === 'High' ? 'var(--color-success)' : msmeProfile.Predicted_Growth_Category === 'Moderate' ? 'var(--color-warning)' : 'var(--color-foreground-muted)'
                            }}
                        >
                            <TrendingUp className="w-4 h-4" />
                            {msmeProfile.Predicted_Growth_Category} Growth Potential
                        </span>
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}
                        >
                            <Award className="w-4 h-4" />
                            {eligibleSchemes.length} Eligible Schemes
                        </span>
                    </div>
                </div>
            </div>

            {/* Impact Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-warning)' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <IndianRupee className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>Total Potential Subsidy</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
                        {formatCurrency(totalSubsidy)}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-foreground-subtle)' }}>across all eligible schemes</p>
                </div>
                <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-success)' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>Avg. Revenue Boost</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                        +{totalRevenueBoost.toFixed(1)}%
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-foreground-subtle)' }}>projected revenue increase</p>
                </div>
                <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-primary)' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-foreground-muted)' }}>New Jobs Created</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        +{totalJobs}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-foreground-subtle)' }}>employment potential</p>
                </div>
            </div>

            {/* Recommended Schemes */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                    <h2 className="text-lg font-semibold">Top Scheme Recommendations</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-background-subtle)', color: 'var(--color-foreground-muted)' }}>
                        Ranked by revenue impact
                    </span>
                </div>

                {eligibleSchemes.length === 0 ? (
                    <div className="p-12 text-center rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}>
                        <p style={{ color: 'var(--color-foreground-muted)' }}>No eligible schemes found for your profile</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {eligibleSchemes.map((e, idx) => {
                            const isExpanded = expandedScheme === e.Scheme_ID;
                            const isTop = idx === 0;
                            return (
                                <div
                                    key={e.Scheme_ID}
                                    className="rounded-xl transition-all"
                                    style={{
                                        backgroundColor: 'var(--color-background-elevated)',
                                        border: isTop ? '1px solid var(--color-warning)' : '1px solid var(--color-border)',
                                        borderLeft: isTop ? '4px solid var(--color-warning)' : '4px solid var(--color-border)'
                                    }}
                                >
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() => setExpandedScheme(isExpanded ? null : e.Scheme_ID)}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                                                    style={{
                                                        backgroundColor: isTop ? 'var(--color-warning)' : 'var(--color-background-subtle)',
                                                        color: isTop ? 'black' : 'var(--color-foreground-muted)'
                                                    }}
                                                >
                                                    {isTop ? <Star className="w-4 h-4" fill="currentColor" /> : `#${idx + 1}`}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h3 className="font-semibold">{e.schemeDetails?.Scheme_Name || e.Scheme_ID}</h3>
                                                        {isTop && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-warning)', color: 'black' }}>
                                                                Best Match
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>{e.Scheme_ID}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue Boost</p>
                                                    <p className="font-bold" style={{ color: 'var(--color-success)' }}>
                                                        +{Number(e.Revenue_Increase_Pct).toFixed(1)}%
                                                    </p>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Subsidy</p>
                                                    <p className="font-bold" style={{ color: 'var(--color-warning)' }}>
                                                        ₹{(Number(e.Subsidy_Applied) / 100000).toFixed(1)}L
                                                    </p>
                                                </div>
                                                <div style={{ color: 'var(--color-foreground-subtle)' }}>
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                                            <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-subtle)', border: '1px solid var(--color-border)' }}>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-muted)' }}>Subsidy Amount</p>
                                                    <p className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>
                                                        {formatCurrency(e.Subsidy_Applied)}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-subtle)', border: '1px solid var(--color-border)' }}>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-muted)' }}>Revenue Increase</p>
                                                    <p className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>
                                                        +{Number(e.Revenue_Increase_Pct).toFixed(2)}%
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-subtle)', border: '1px solid var(--color-border)' }}>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-muted)' }}>New Jobs</p>
                                                    <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                                                        +{e.New_Jobs_Added}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-subtle)', border: '1px solid var(--color-border)' }}>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-muted)' }}>Max Subsidy Cap</p>
                                                    <p className="text-lg font-bold">
                                                        {formatCurrency(e.schemeDetails?.Max_Subsidy_Amount || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
