import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Building, Loader2, ChevronDown, ChevronUp, ArrowRight, Users, DollarSign } from 'lucide-react';

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

    const getCategoryBadge = (category) => {
        const badges = {
            'High': 'badge-success',
            'Moderate': 'badge-warning',
            'Low': 'badge-error'
        };
        return badges[category] || 'badge-info';
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">MSME Growth Advisory</h2>
                <p className="text-secondary-400">Search and analyze MSME profiles with AI-predicted growth potential</p>
            </div>

            <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                    type="text"
                    className="input-field pl-12 h-12"
                    placeholder="Search by MSME ID, Sector, or Location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button type="submit" className="btn-primary h-9">
                        Search
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
                    <p className="mt-4 text-secondary-400 font-medium">Loading MSME data...</p>
                </div>
            ) : searched && results.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-secondary-400">No MSME records found matching "{query}"</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((item) => (
                        <div key={item.MSME_ID} className={`card card-hover ${expandedMsme === item.MSME_ID ? 'ring-2 ring-primary-500' : ''}`}>
                            <div className="p-6 cursor-pointer" onClick={() => toggleMsme(item.MSME_ID)}>
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="p-3 bg-primary-600/10 rounded-lg">
                                            <Building className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-white">{item.MSME_ID}</h3>
                                                <span className={`badge ${getCategoryBadge(item.Predicted_Growth_Category)}`}>
                                                    {item.Predicted_Growth_Category} Growth
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center text-sm text-secondary-400 gap-4">
                                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {item.Location_Type}</span>
                                                <span>{item.Sector}</span>
                                                <span>{item.Category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs text-secondary-400 mb-1">Revenue</p>
                                            <p className="text-sm font-semibold text-white">₹{(item.Annual_Revenue / 10000000).toFixed(2)} Cr</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondary-400 mb-1">Compliance</p>
                                            <p className="text-sm font-semibold text-success-500">{Math.round(item.GST_Compliance_Score)}%</p>
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <p className="text-xs text-secondary-400 mb-1">Growth Score</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-secondary-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            parseFloat(item.Growth_Score) > 70 ? 'bg-success-500' :
                                                            parseFloat(item.Growth_Score) > 40 ? 'bg-warning-500' : 'bg-error-500'
                                                        }`}
                                                        style={{ width: `${item.Growth_Score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-white">{Math.round(item.Growth_Score)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:pl-4">
                                        {expandedMsme === item.MSME_ID ? <ChevronUp className="text-secondary-400" /> : <ChevronDown className="text-secondary-400" />}
                                    </div>
                                </div>
                            </div>

                            {expandedMsme === item.MSME_ID && (
                                <div className="border-t border-secondary-700 p-6 bg-secondary-900/50">
                                    <h4 className="text-sm font-semibold text-white mb-4">Eligible Schemes & Impact Projections</h4>

                                    {schemesLoading && !msmeSchemes[item.MSME_ID] ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 text-primary-500 animate-spin mr-3" />
                                            <span className="text-sm text-secondary-400">Loading schemes...</span>
                                        </div>
                                    ) : msmeSchemes[item.MSME_ID]?.length === 0 ? (
                                        <p className="text-sm text-secondary-400 py-4">No eligible schemes found for this MSME profile.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(msmeSchemes[item.MSME_ID] || []).map((scheme) => (
                                                <div key={scheme.Scheme_ID} className={`p-5 rounded-lg border ${scheme.is_recommended ? 'bg-primary-500/5 border-primary-500/20' : 'bg-secondary-800 border-secondary-700'}`}>
                                                    {scheme.is_recommended && (
                                                        <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full mb-3">
                                                            Recommended
                                                        </span>
                                                    )}
                                                    <h5 className="text-white font-semibold mb-4">{scheme.Scheme_Name}</h5>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-secondary-400 mb-2">Revenue Impact</p>
                                                            <div className="flex items-center gap-2 text-xs text-secondary-300 mb-1">
                                                                <span>{formatCurrency(scheme.Before_Annual_Revenue)}</span>
                                                                <ArrowRight className="w-3 h-3" />
                                                                <span className="text-success-500 font-semibold">{formatCurrency(scheme.Projected_Revenue)}</span>
                                                            </div>
                                                            <p className="text-lg font-bold text-white">+{scheme.Revenue_Increase_Pct}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-secondary-400 mb-2">Jobs Created</p>
                                                            <div className="flex items-center gap-2 text-xs text-secondary-300 mb-1">
                                                                <span>{scheme.Before_Employees}</span>
                                                                <ArrowRight className="w-3 h-3" />
                                                                <span className="text-success-500 font-semibold">{scheme.Projected_Employees}</span>
                                                            </div>
                                                            <p className="text-lg font-bold text-white">+{scheme.New_Jobs_Added}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-secondary-700 flex justify-between items-center text-xs">
                                                        <span className="text-secondary-400">Max Subsidy: {formatCurrency(scheme.Max_Subsidy_Amount)}</span>
                                                        <span className="text-primary-400 font-semibold">{formatCurrency(scheme.Subsidy_Applied)}</span>
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
    );
}
