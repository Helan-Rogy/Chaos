import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Building, Loader2, Star, ChevronDown, ChevronUp, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdvisoryTab() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [expandedMsme, setExpandedMsme] = useState(null);
    const [msmeSchemes, setMsmeSchemes] = useState({});
    const [schemesLoading, setSchemesLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSearched(true);
        setExpandedMsme(null);
        try {
            const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const fetchSchemes = async (msmeId) => {
        if (msmeSchemes[msmeId]) return;
        setSchemesLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/msme/${msmeId}/schemes`);
            setMsmeSchemes(prev => ({ ...prev, [msmeId]: res.data }));
        } catch (err) {
            console.error(err);
        } finally {
            setSchemesLoading(false);
        }
    };

    const toggleMsme = (msmeId) => {
        if (expandedMsme === msmeId) {
            setExpandedMsme(null);
        } else {
            setExpandedMsme(msmeId);
            fetchSchemes(msmeId);
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const quickFilters = ['Manufacturing', 'IT Services', 'Urban', 'Rural', 'High Growth'];

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
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Growth Advisory Dashboard
                </h1>
                <p style={{ color: 'var(--color-foreground-muted)' }} className="max-w-2xl">
                    Search and analyze MSME profiles with AI-powered growth predictions and scheme recommendations.
                </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                    <Search 
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" 
                        style={{ color: 'var(--color-foreground-subtle)' }}
                    />
                    <input
                        type="text"
                        className="w-full pl-12 pr-28 h-14 text-base rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-foreground)'
                        }}
                        placeholder="Search MSME ID, Sector, or Location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button 
                            type="submit" 
                            className="h-10 px-5 rounded-lg font-medium transition-all"
                            style={{ 
                                backgroundColor: 'var(--color-primary)', 
                                color: 'white' 
                            }}
                        >
                            Analyze
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {quickFilters.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => { setQuery(tag); setTimeout(() => handleSearch(), 100); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{
                                backgroundColor: 'var(--color-background-subtle)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-foreground-muted)'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </form>

            {/* Results */}
            <div className="space-y-4 min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        <p style={{ color: 'var(--color-foreground-muted)' }} className="text-sm">Running predictive models...</p>
                    </div>
                ) : searched && results.length === 0 ? (
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
                        {results.map((item) => (
                            <div 
                                key={item.MSME_ID} 
                                className="rounded-xl transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: expandedMsme === item.MSME_ID 
                                        ? '1px solid var(--color-primary)' 
                                        : '1px solid var(--color-border)'
                                }}
                            >
                                {/* Card Header */}
                                <div 
                                    className="p-5 cursor-pointer transition-colors" 
                                    onClick={() => toggleMsme(item.MSME_ID)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

                                        <div className="flex items-center gap-8 lg:gap-12">
                                            <div className="space-y-1">
                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue</p>
                                                <p className="text-sm font-semibold">
                                                    {(item.Annual_Revenue / 10000000).toFixed(2)} Cr
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Compliance</p>
                                                <p className="text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    {Math.round(item.GST_Compliance_Score)}%
                                                </p>
                                            </div>
                                            <div className="space-y-1.5 min-w-[120px]">
                                                <div className="flex justify-between">
                                                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Growth Score</p>
                                                    <p 
                                                        className="text-xs font-semibold"
                                                        style={{
                                                            color: parseFloat(item.Growth_Score) > 70 
                                                                ? 'var(--color-success)' 
                                                                : parseFloat(item.Growth_Score) > 40 
                                                                ? 'var(--color-warning)' 
                                                                : 'var(--color-foreground-muted)'
                                                        }}
                                                    >
                                                        {Math.round(item.Growth_Score)}/100
                                                    </p>
                                                </div>
                                                <div 
                                                    className="w-full h-1.5 rounded-full overflow-hidden"
                                                    style={{ backgroundColor: 'var(--color-background-muted)' }}
                                                >
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700"
                                                        style={{ 
                                                            width: `${item.Growth_Score}%`,
                                                            backgroundColor: parseFloat(item.Growth_Score) > 70 
                                                                ? 'var(--color-success)'
                                                                : parseFloat(item.Growth_Score) > 40 
                                                                ? 'var(--color-warning)'
                                                                : 'var(--color-foreground-subtle)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="hidden lg:block" style={{ color: 'var(--color-foreground-subtle)' }}>
                                                {expandedMsme === item.MSME_ID ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Panel */}
                                {expandedMsme === item.MSME_ID && (
                                    <div 
                                        className="p-5"
                                        style={{
                                            borderTop: '1px solid var(--color-border)',
                                            backgroundColor: 'rgba(23, 23, 23, 0.3)'
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-5">
                                            <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                            <h4 className="text-sm font-semibold">Eligible Scheme Projections</h4>
                                        </div>

                                        {schemesLoading && !msmeSchemes[item.MSME_ID] ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" style={{ color: 'var(--color-primary)' }} />
                                                <span className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>Calculating impact factors...</span>
                                            </div>
                                        ) : msmeSchemes[item.MSME_ID]?.length === 0 ? (
                                            <p className="text-sm py-4" style={{ color: 'var(--color-foreground-muted)' }}>
                                                No eligible schemes identified for this profile.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(msmeSchemes[item.MSME_ID] || []).map((scheme) => (
                                                    <div 
                                                        key={scheme.Scheme_ID} 
                                                        className="relative p-4 rounded-xl"
                                                        style={{
                                                            backgroundColor: scheme.is_recommended 
                                                                ? 'var(--color-primary-muted)' 
                                                                : 'var(--color-background-elevated)',
                                                            border: scheme.is_recommended
                                                                ? '1px solid rgba(59, 130, 246, 0.3)'
                                                                : '1px solid var(--color-border)'
                                                        }}
                                                    >
                                                        {scheme.is_recommended && (
                                                            <div 
                                                                className="absolute top-0 right-0 px-2.5 py-1 text-xs font-medium rounded-bl-lg rounded-tr-xl flex items-center gap-1"
                                                                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                                                            >
                                                                <Star className="w-3 h-3" /> Best Match
                                                            </div>
                                                        )}
                                                        <h5 className="font-semibold mb-4 pr-20">{scheme.Scheme_Name}</h5>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue Boost</p>
                                                                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-foreground-muted)' }}>
                                                                    <span>{formatCurrency(scheme.Before_Annual_Revenue)}</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                    <span className="font-medium" style={{ color: 'var(--color-success)' }}>{formatCurrency(scheme.Projected_Revenue)}</span>
                                                                </div>
                                                                <p className="text-lg font-bold">+{scheme.Revenue_Increase_Pct}%</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-subtle)' }}>Jobs Created</p>
                                                                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-foreground-muted)' }}>
                                                                    <span>{scheme.Before_Employees}</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                    <span className="font-medium" style={{ color: 'var(--color-warning)' }}>{scheme.Projected_Employees}</span>
                                                                </div>
                                                                <p className="text-lg font-bold">+{scheme.New_Jobs_Added}</p>
                                                            </div>
                                                        </div>

                                                        <div 
                                                            className="mt-4 pt-3 flex justify-between items-center"
                                                            style={{ borderTop: '1px solid var(--color-border)' }}
                                                        >
                                                            <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                                                                Cap: {formatCurrency(scheme.Max_Subsidy_Amount)}
                                                            </span>
                                                            <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                                                                {Math.round(scheme.Subsidy_Applied).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
