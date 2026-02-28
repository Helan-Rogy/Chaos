import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, TrendingUp, DollarSign, Building, Loader2, Sparkles, Star, ChevronDown, ChevronUp, ArrowRight, Activity } from 'lucide-react';

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

    // Initial load
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

    return (
        <div className="space-y-12 max-w-6xl mx-auto">

            {/* Hero Section / Search */}
            <div className="text-center space-y-6 pt-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-artha-saffron/10 border border-artha-saffron/20 text-artha-saffron text-xs font-bold uppercase tracking-widest animate-float">
                    <Sparkles className="w-3 h-3 mr-2" />
                    Layer 1: Advisory Intelligence
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                    Growth <span className="text-artha-saffron">Advisory</span> Dashboard
                </h1>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group pt-4">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-artha-slate group-focus-within:text-artha-saffron transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="search-input pl-12 h-16 text-lg"
                        placeholder="Search MSME ID, Sector, or Location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button type="submit" className="premium-button h-12 flex items-center px-6">
                            Analyze
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {['Manufacturing', 'IT Services', 'Urban', 'Rural', 'High Growth'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => { setQuery(tag); setTimeout(() => handleSearch(), 100); }}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-artha-slate uppercase hover:bg-white/10 hover:text-white transition-all"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-8 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-20">
                        <Loader2 className="h-12 w-12 text-artha-saffron animate-spin" />
                        <p className="text-artha-slate font-display font-bold animate-pulse">Running Predictive Models...</p>
                    </div>
                ) : searched && results.length === 0 ? (
                    <div className="glass-card p-12 text-center text-artha-slate">
                        <p>No MSME records found matching "{query}"</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {results.map((item, idx) => (
                            <div key={item.MSME_ID} className={`glass-card transition-all duration-300 ${expandedMsme === item.MSME_ID ? 'ring-2 ring-artha-saffron/50 bg-white/5' : 'hover:bg-white/[0.03]'}`}>
                                {/* Main Card Content */}
                                <div className="p-6 cursor-pointer" onClick={() => toggleMsme(item.MSME_ID)}>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-artha-navy rounded-xl border border-white/10 mt-1">
                                                <Building className="w-6 h-6 text-artha-saffron" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="text-xl font-display font-bold text-white">{item.MSME_ID}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.Predicted_Growth_Category === 'High' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                            item.Predicted_Growth_Category === 'Moderate' ? 'bg-artha-saffron/20 text-artha-saffron border border-artha-saffron/30' :
                                                                'bg-artha-slate/20 text-artha-slate border border-white/10'
                                                        }`}>
                                                        {item.Predicted_Growth_Category} Growth
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center text-xs text-artha-slate font-semibold gap-x-3 gap-y-1">
                                                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {item.Location_Type}</span>
                                                    <span className="text-white/20">|</span>
                                                    <span>{item.Sector}</span>
                                                    <span className="text-white/20">|</span>
                                                    <span>{item.Category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 flex-1 lg:justify-end lg:items-center px-4 lg:px-12">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-artha-slate uppercase tracking-tighter">Annual Revenue</p>
                                                <p className="text-sm font-bold text-white">₹{(item.Annual_Revenue / 10000000).toFixed(2)} Cr</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-artha-slate uppercase tracking-tighter">Compliance</p>
                                                <p className="text-sm font-bold text-artha-gold">{Math.round(item.GST_Compliance_Score)}%</p>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[10px] font-bold text-artha-slate uppercase tracking-tighter">Growth Score</p>
                                                    <p className={`text-xs font-bold ${parseFloat(item.Growth_Score) > 70 ? 'text-emerald-400' : parseFloat(item.Growth_Score) > 40 ? 'text-artha-saffron' : 'text-artha-slate'}`}>
                                                        {Math.round(item.Growth_Score)}/100
                                                    </p>
                                                </div>
                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${parseFloat(item.Growth_Score) > 70 ? 'bg-emerald-500 shadow-glow-emerald' :
                                                                parseFloat(item.Growth_Score) > 40 ? 'bg-artha-saffron shadow-glow-saffron' :
                                                                    'bg-artha-slate'
                                                            }`}
                                                        style={{ width: `${item.Growth_Score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:pl-6 border-l border-white/5 hidden lg:block">
                                            {expandedMsme === item.MSME_ID ? <ChevronUp className="text-artha-slate" /> : <ChevronDown className="text-artha-slate" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Schemes Panel */}
                                {expandedMsme === item.MSME_ID && (
                                    <div className="border-t border-white/10 p-6 bg-artha-navy/30 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="flex items-center mb-6">
                                            <Activity className="w-4 h-4 text-artha-saffron mr-2" />
                                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Eligible Scheme Projections</h4>
                                        </div>

                                        {schemesLoading && !msmeSchemes[item.MSME_ID] ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-6 w-6 text-artha-saffron animate-spin mr-3" />
                                                <span className="text-xs text-artha-slate font-medium">Crunching Impact Factors...</span>
                                            </div>
                                        ) : msmeSchemes[item.MSME_ID]?.length === 0 ? (
                                            <p className="text-xs text-artha-slate italic py-4">No eligible schemes identified for this profile's current metrics.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(msmeSchemes[item.MSME_ID] || []).map((scheme) => (
                                                    <div key={scheme.Scheme_ID} className={`relative p-5 rounded-2xl border ${scheme.is_recommended ? 'bg-artha-saffron/5 border-artha-saffron/20' : 'bg-white/5 border-white/5'} overflow-hidden`}>
                                                        {scheme.is_recommended && (
                                                            <div className="absolute top-0 right-0 px-3 py-1 bg-artha-saffron text-artha-navy text-[10px] font-bold uppercase rounded-bl-xl flex items-center">
                                                                <Star className="w-3 h-3 mr-1 fill-artha-navy" /> Best Match
                                                            </div>
                                                        )}
                                                        <h5 className="text-white font-bold mb-4 pr-16">{scheme.Scheme_Name}</h5>

                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-bold text-artha-slate uppercase">Revenue Boost</p>
                                                                <div className="flex items-center text-[10px] font-medium text-artha-slate">
                                                                    <span>{formatCurrency(scheme.Before_Annual_Revenue)}</span>
                                                                    <ArrowRight className="w-3 h-3 mx-1 opacity-50" />
                                                                    <span className="text-emerald-400 font-bold">{formatCurrency(scheme.Projected_Revenue)}</span>
                                                                </div>
                                                                <p className="text-xl font-display font-bold text-white">+{scheme.Revenue_Increase_Pct}%</p>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-bold text-artha-slate uppercase">Jobs Created</p>
                                                                <div className="flex items-center text-[10px] font-medium text-artha-slate">
                                                                    <span>{scheme.Before_Employees}</span>
                                                                    <ArrowRight className="w-3 h-3 mx-1 opacity-50" />
                                                                    <span className="text-artha-gold font-bold">{scheme.Projected_Employees}</span>
                                                                </div>
                                                                <p className="text-xl font-display font-bold text-white">+{scheme.New_Jobs_Added} <span className="text-[10px] text-artha-slate font-sans">Posts</span></p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                                                            <span className="text-[10px] font-bold text-artha-slate uppercase">Subsidy Cap: {formatCurrency(scheme.Max_Subsidy_Amount)}</span>
                                                            <span className="text-xs font-bold text-artha-saffron">₹{Math.round(scheme.Subsidy_Applied).toLocaleString()} Disbursement</span>
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
