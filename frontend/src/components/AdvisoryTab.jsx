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
                <div className="badge badge-primary">
                    Advisory Intelligence
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Growth Advisory Dashboard
                </h1>
                <p className="text-foreground-muted max-w-2xl">
                    Search and analyze MSME profiles with AI-powered growth predictions and scheme recommendations.
                </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-subtle" />
                    <input
                        type="text"
                        className="input pl-12 pr-28 h-14 text-base"
                        placeholder="Search MSME ID, Sector, or Location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button type="submit" className="btn-primary h-10">
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
                            className="px-3 py-1.5 rounded-lg bg-background-subtle border border-border text-xs font-medium text-foreground-muted hover:bg-background-muted hover:text-foreground transition-all"
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
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <p className="text-foreground-muted text-sm">Running predictive models...</p>
                    </div>
                ) : searched && results.length === 0 ? (
                    <div className="card p-12 text-center">
                        <p className="text-foreground-muted">No MSME records found matching "{query}"</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {results.map((item) => (
                            <div 
                                key={item.MSME_ID} 
                                className={`card transition-all duration-200 ${expandedMsme === item.MSME_ID ? 'ring-1 ring-primary/50' : ''}`}
                            >
                                {/* Card Header */}
                                <div 
                                    className="p-5 cursor-pointer hover:bg-background-subtle/50 transition-colors" 
                                    onClick={() => toggleMsme(item.MSME_ID)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 bg-background-subtle rounded-lg border border-border">
                                                <Building className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-semibold text-foreground">{item.MSME_ID}</h3>
                                                    <span className={`badge ${
                                                        item.Predicted_Growth_Category === 'High' ? 'badge-success' :
                                                        item.Predicted_Growth_Category === 'Moderate' ? 'badge-warning' :
                                                        'badge-neutral'
                                                    }`}>
                                                        {item.Predicted_Growth_Category} Growth
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground-muted">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {item.Location_Type}
                                                    </span>
                                                    <span className="text-border">|</span>
                                                    <span>{item.Sector}</span>
                                                    <span className="text-border">|</span>
                                                    <span>{item.Category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 lg:gap-12">
                                            <div className="space-y-1">
                                                <p className="text-xs text-foreground-subtle">Revenue</p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {(item.Annual_Revenue / 10000000).toFixed(2)} Cr
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-foreground-subtle">Compliance</p>
                                                <p className="text-sm font-semibold text-warning">{Math.round(item.GST_Compliance_Score)}%</p>
                                            </div>
                                            <div className="space-y-1.5 min-w-[120px]">
                                                <div className="flex justify-between">
                                                    <p className="text-xs text-foreground-subtle">Growth Score</p>
                                                    <p className={`text-xs font-semibold ${
                                                        parseFloat(item.Growth_Score) > 70 ? 'text-success' : 
                                                        parseFloat(item.Growth_Score) > 40 ? 'text-warning' : 'text-foreground-muted'
                                                    }`}>
                                                        {Math.round(item.Growth_Score)}/100
                                                    </p>
                                                </div>
                                                <div className="w-full bg-background-muted h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${
                                                            parseFloat(item.Growth_Score) > 70 ? 'bg-success' :
                                                            parseFloat(item.Growth_Score) > 40 ? 'bg-warning' :
                                                            'bg-foreground-subtle'
                                                        }`}
                                                        style={{ width: `${item.Growth_Score}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="hidden lg:block text-foreground-subtle">
                                                {expandedMsme === item.MSME_ID ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Panel */}
                                {expandedMsme === item.MSME_ID && (
                                    <div className="border-t border-border p-5 bg-background-subtle/30 animate-fade-in">
                                        <div className="flex items-center gap-2 mb-5">
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                            <h4 className="text-sm font-semibold text-foreground">Eligible Scheme Projections</h4>
                                        </div>

                                        {schemesLoading && !msmeSchemes[item.MSME_ID] ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
                                                <span className="text-sm text-foreground-muted">Calculating impact factors...</span>
                                            </div>
                                        ) : msmeSchemes[item.MSME_ID]?.length === 0 ? (
                                            <p className="text-sm text-foreground-muted py-4">
                                                No eligible schemes identified for this profile.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(msmeSchemes[item.MSME_ID] || []).map((scheme) => (
                                                    <div 
                                                        key={scheme.Scheme_ID} 
                                                        className={`relative p-4 rounded-xl border ${
                                                            scheme.is_recommended 
                                                                ? 'bg-primary-muted border-primary/30' 
                                                                : 'bg-background-elevated border-border'
                                                        }`}
                                                    >
                                                        {scheme.is_recommended && (
                                                            <div className="absolute top-0 right-0 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                                                                <Star className="w-3 h-3" /> Best Match
                                                            </div>
                                                        )}
                                                        <h5 className="text-foreground font-semibold mb-4 pr-20">{scheme.Scheme_Name}</h5>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <p className="text-xs text-foreground-subtle font-medium">Revenue Boost</p>
                                                                <div className="flex items-center gap-1 text-xs text-foreground-muted">
                                                                    <span>{formatCurrency(scheme.Before_Annual_Revenue)}</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                    <span className="text-success font-medium">{formatCurrency(scheme.Projected_Revenue)}</span>
                                                                </div>
                                                                <p className="text-lg font-bold text-foreground">+{scheme.Revenue_Increase_Pct}%</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-xs text-foreground-subtle font-medium">Jobs Created</p>
                                                                <div className="flex items-center gap-1 text-xs text-foreground-muted">
                                                                    <span>{scheme.Before_Employees}</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                    <span className="text-warning font-medium">{scheme.Projected_Employees}</span>
                                                                </div>
                                                                <p className="text-lg font-bold text-foreground">+{scheme.New_Jobs_Added}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                                                            <span className="text-xs text-foreground-subtle">
                                                                Cap: {formatCurrency(scheme.Max_Subsidy_Amount)}
                                                            </span>
                                                            <span className="text-sm font-semibold text-primary">
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
