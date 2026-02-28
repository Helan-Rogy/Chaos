import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Star, ChevronDown, ChevronUp, TrendingUp, Loader2 } from 'lucide-react';
import { loadCSV } from '../utils/csvParser';

export default function AdvisoryTab() {
    const [query, setQuery] = useState("");
    const [expandedMsme, setExpandedMsme] = useState(null);
    const [msmeData, setMsmeData] = useState([]);
    const [eligibilityData, setEligibilityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [predictions, eligibility] = await Promise.all([
                loadCSV('/data/msme_predictions.csv'),
                loadCSV('/data/scheme_eligibility_results.csv')
            ]);
            setMsmeData(predictions);
            setEligibilityData(eligibility);
            setLoading(false);
        }
        fetchData();
    }, []);

    const getSchemesForMsme = (msmeId) => {
        return eligibilityData.filter(e => e.MSME_ID === msmeId);
    };

    const filteredResults = msmeData.filter(item => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
            item.MSME_ID?.toLowerCase().includes(q) ||
            item.Sector?.toLowerCase().includes(q) ||
            item.Location_Type?.toLowerCase().includes(q) ||
            item.Category?.toLowerCase().includes(q) ||
            item.Predicted_Growth_Category?.toLowerCase().includes(q)
        );
    }).slice(0, 50);

    const toggleMsme = (msmeId) => {
        setExpandedMsme(expandedMsme === msmeId ? null : msmeId);
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const quickFilters = ['Manufacturing', 'IT Services', 'Urban', 'Rural', 'High'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading advisory data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{
                        backgroundColor: 'var(--color-primary-muted)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}
                >
                    Advisory Intelligence
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">Growth Advisory Dashboard</h1>
                <p style={{ color: 'var(--color-foreground-muted)' }} className="max-w-2xl">
                    Search and analyze {msmeData.length} MSME profiles with AI-powered growth predictions and scheme recommendations.
                </p>
            </div>

            {/* Search */}
            <div className="space-y-4">
                <div className="relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: 'var(--color-foreground-subtle)' }}
                    />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 h-14 text-base rounded-lg transition-all focus:outline-none"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-foreground)'
                        }}
                        placeholder="Search MSME ID, Sector, or Location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {quickFilters.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                            style={{
                                backgroundColor: 'var(--color-background-subtle)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-foreground-muted)'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4 min-h-[300px]">
                <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                    Showing {filteredResults.length} of {msmeData.length} records
                </p>

                {filteredResults.length === 0 ? (
                    <div
                        className="p-12 text-center rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <p style={{ color: 'var(--color-foreground-muted)' }}>No MSME records found matching "{query}"</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredResults.map((item) => {
                            const schemes = getSchemesForMsme(item.MSME_ID);
                            const isExpanded = expandedMsme === item.MSME_ID;
                            const growthScore = Number(item.Growth_Score);
                            const growthColor = growthScore > 70
                                ? 'var(--color-success)'
                                : growthScore > 40
                                ? 'var(--color-warning)'
                                : 'var(--color-foreground-subtle)';

                            return (
                                <div
                                    key={item.MSME_ID}
                                    className="rounded-xl transition-all duration-200"
                                    style={{
                                        backgroundColor: 'var(--color-background-elevated)',
                                        border: isExpanded
                                            ? '1px solid var(--color-primary)'
                                            : '1px solid var(--color-border)'
                                    }}
                                >
                                    {/* Card Header */}
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() => toggleMsme(item.MSME_ID)}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Left: identity */}
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="p-2.5 rounded-lg"
                                                    style={{
                                                        backgroundColor: 'var(--color-background-subtle)',
                                                        border: '1px solid var(--color-border)'
                                                    }}
                                                >
                                                    <Building className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-lg font-semibold">{item.MSME_ID}</h3>
                                                        <span
                                                            className="px-2.5 py-1 rounded-md text-xs font-medium"
                                                            style={{
                                                                backgroundColor: item.Predicted_Growth_Category === 'High'
                                                                    ? 'var(--color-success-muted)'
                                                                    : item.Predicted_Growth_Category === 'Moderate'
                                                                    ? 'var(--color-warning-muted)'
                                                                    : 'var(--color-background-muted)',
                                                                color: item.Predicted_Growth_Category === 'High'
                                                                    ? 'var(--color-success)'
                                                                    : item.Predicted_Growth_Category === 'Moderate'
                                                                    ? 'var(--color-warning)'
                                                                    : 'var(--color-foreground-muted)'
                                                            }}
                                                        >
                                                            {item.Predicted_Growth_Category} Growth
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
                                                        style={{ color: 'var(--color-foreground-muted)' }}
                                                    >
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {item.Location_Type}
                                                        </span>
                                                        <span style={{ color: 'var(--color-border)' }}>|</span>
                                                        <span>{item.Sector}</span>
                                                        <span style={{ color: 'var(--color-border)' }}>|</span>
                                                        <span>{item.Category}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: stats */}
                                            <div className="flex items-center gap-8 lg:gap-12">
                                                <div className="space-y-1">
                                                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue</p>
                                                    <p className="text-sm font-semibold">
                                                        ₹{(Number(item.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Employees</p>
                                                    <p className="text-sm font-semibold">{item.Number_of_Employees}</p>
                                                </div>
                                                <div className="space-y-1.5 min-w-[120px]">
                                                    <div className="flex justify-between">
                                                        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Growth Score</p>
                                                        <p className="text-xs font-semibold" style={{ color: growthColor }}>
                                                            {Math.round(growthScore)}/100
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="w-full h-1.5 rounded-full overflow-hidden"
                                                        style={{ backgroundColor: 'var(--color-background-muted)' }}
                                                    >
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{ width: `${growthScore}%`, backgroundColor: growthColor }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="hidden lg:block" style={{ color: 'var(--color-foreground-subtle)' }}>
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Panel */}
                                    {isExpanded && schemes.length > 0 && (
                                        <div
                                            className="p-5"
                                            style={{
                                                borderTop: '1px solid var(--color-border)',
                                                backgroundColor: 'rgba(23, 23, 23, 0.3)'
                                            }}
                                        >
                                            <div className="flex items-center gap-2 mb-5">
                                                <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                                <h4 className="text-sm font-semibold">
                                                    Eligible Scheme Projections ({schemes.length} schemes)
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {schemes.slice(0, 6).map((scheme, idx) => (
                                                    <div
                                                        key={`${scheme.Scheme_ID}-${idx}`}
                                                        className="relative p-4 rounded-xl"
                                                        style={{
                                                            backgroundColor: idx === 0
                                                                ? 'var(--color-primary-muted)'
                                                                : 'var(--color-background-elevated)',
                                                            border: idx === 0
                                                                ? '1px solid rgba(59, 130, 246, 0.3)'
                                                                : '1px solid var(--color-border)'
                                                        }}
                                                    >
                                                        {idx === 0 && (
                                                            <div
                                                                className="absolute -top-2 -right-2 p-1.5 rounded-full"
                                                                style={{ backgroundColor: 'var(--color-warning)' }}
                                                            >
                                                                <Star className="w-3 h-3 text-black" fill="currentColor" />
                                                            </div>
                                                        )}
                                                        <p
                                                            className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
                                                            style={{ color: 'var(--color-foreground-subtle)' }}
                                                        >
                                                            {scheme.Scheme_ID}
                                                        </p>
                                                        <h5 className="font-semibold text-sm mb-3">{scheme.Scheme_Name}</h5>
                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex justify-between">
                                                                <span style={{ color: 'var(--color-foreground-muted)' }}>Subsidy</span>
                                                                <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                                    {formatCurrency(scheme.Subsidy_Applied || scheme.Max_Subsidy_Amount)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span style={{ color: 'var(--color-foreground-muted)' }}>Revenue Boost</span>
                                                                <span className="font-semibold" style={{ color: 'var(--color-success)' }}>
                                                                    +{Number(scheme.Revenue_Increase_Pct).toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span style={{ color: 'var(--color-foreground-muted)' }}>Jobs Added</span>
                                                                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                                                                    +{scheme.New_Jobs_Added}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {isExpanded && schemes.length === 0 && (
                                        <div
                                            className="p-5 text-center"
                                            style={{
                                                borderTop: '1px solid var(--color-border)',
                                                backgroundColor: 'rgba(23, 23, 23, 0.3)'
                                            }}
                                        >
                                            <p style={{ color: 'var(--color-foreground-muted)' }}>No eligible schemes found for this MSME.</p>
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
