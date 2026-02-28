import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, TrendingUp, IndianRupee, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loadCSV } from '../../utils/csvParser';

export default function SchemeBrowser() {
    const { user } = useAuth();
    const [schemes, setSchemes] = useState([]);
    const [eligibility, setEligibility] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEligible, setFilterEligible] = useState('all'); // 'all', 'eligible', 'not-eligible'
    const [expandedScheme, setExpandedScheme] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [schemesData, eligibilityData] = await Promise.all([
                loadCSV('/data/schemes_data.csv'),
                loadCSV('/data/scheme_eligibility_results.csv')
            ]);
            setSchemes(schemesData);
            setEligibility(eligibilityData);
            setLoading(false);
        }
        fetchData();
    }, []);

    // Get eligibility info for user's MSME
    const getEligibilityForScheme = (schemeId) => {
        return eligibility.find(e => e.MSME_ID === user.msmeId && e.Scheme_ID === schemeId);
    };

    // Check if MSME is eligible for a scheme
    const isEligible = (schemeId) => {
        return !!getEligibilityForScheme(schemeId);
    };

    // Filter schemes
    const filteredSchemes = schemes.filter(scheme => {
        const matchesSearch = !searchQuery || 
            scheme.Scheme_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.Scheme_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.Description?.toLowerCase().includes(searchQuery.toLowerCase());

        const eligible = isEligible(scheme.Scheme_ID);
        const matchesFilter = filterEligible === 'all' || 
            (filterEligible === 'eligible' && eligible) ||
            (filterEligible === 'not-eligible' && !eligible);

        return matchesSearch && matchesFilter;
    });

    const eligibleCount = schemes.filter(s => isEligible(s.Scheme_ID)).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading schemes...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ 
                        backgroundColor: 'var(--color-success-muted)', 
                        color: 'var(--color-success)',
                        border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}
                >
                    Scheme Browser
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Government Schemes for Your Business
                </h1>
                <p style={{ color: 'var(--color-foreground-muted)' }}>
                    You are eligible for <span className="font-semibold" style={{ color: 'var(--color-success)' }}>{eligibleCount}</span> out of {schemes.length} available schemes
                </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search 
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" 
                        style={{ color: 'var(--color-foreground-subtle)' }}
                    />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 h-12 rounded-lg transition-all focus:outline-none"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-foreground)'
                        }}
                        placeholder="Search schemes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'eligible', 'not-eligible'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setFilterEligible(filter)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                backgroundColor: filterEligible === filter 
                                    ? 'var(--color-primary)' 
                                    : 'var(--color-background-subtle)',
                                color: filterEligible === filter ? 'white' : 'var(--color-foreground-muted)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            {filter === 'all' ? 'All' : filter === 'eligible' ? 'Eligible' : 'Not Eligible'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schemes Grid */}
            <div className="space-y-4">
                {filteredSchemes.length === 0 ? (
                    <div 
                        className="p-12 text-center rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <p style={{ color: 'var(--color-foreground-muted)' }}>No schemes found matching your criteria</p>
                    </div>
                ) : (
                    filteredSchemes.map((scheme) => {
                        const eligible = isEligible(scheme.Scheme_ID);
                        const eligibilityInfo = getEligibilityForScheme(scheme.Scheme_ID);
                        const isExpanded = expandedScheme === scheme.Scheme_ID;

                        return (
                            <div 
                                key={scheme.Scheme_ID}
                                className="rounded-xl transition-all"
                                style={{
                                    backgroundColor: 'var(--color-background-elevated)',
                                    border: eligible 
                                        ? '1px solid var(--color-success)' 
                                        : '1px solid var(--color-border)',
                                    borderLeft: eligible ? '4px solid var(--color-success)' : '4px solid var(--color-border)'
                                }}
                            >
                                <div 
                                    className="p-5 cursor-pointer"
                                    onClick={() => setExpandedScheme(isExpanded ? null : scheme.Scheme_ID)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {eligible ? (
                                                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                                                ) : (
                                                    <XCircle className="w-5 h-5" style={{ color: 'var(--color-foreground-subtle)' }} />
                                                )}
                                                <span 
                                                    className="text-xs font-medium px-2 py-0.5 rounded"
                                                    style={{ 
                                                        backgroundColor: eligible ? 'var(--color-success-muted)' : 'var(--color-background-muted)',
                                                        color: eligible ? 'var(--color-success)' : 'var(--color-foreground-muted)'
                                                    }}
                                                >
                                                    {eligible ? 'Eligible' : 'Not Eligible'}
                                                </span>
                                                <span className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                                                    {scheme.Scheme_ID}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-lg mb-1">{scheme.Scheme_Name}</h3>
                                            <p className="text-sm line-clamp-2" style={{ color: 'var(--color-foreground-muted)' }}>
                                                {scheme.Description || `Government scheme offering subsidies up to ₹${Number(scheme.Max_Subsidy_Amount).toLocaleString('en-IN')} for eligible MSMEs`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Max Subsidy</p>
                                                <p className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    ₹{(Number(scheme.Max_Subsidy_Amount) / 100000).toFixed(1)}L
                                                </p>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5" style={{ color: 'var(--color-foreground-subtle)' }} />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-foreground-subtle)' }} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div 
                                        className="px-5 pb-5"
                                        style={{ borderTop: '1px solid var(--color-border)' }}
                                    >
                                        <div className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div 
                                                className="p-4 rounded-lg"
                                                style={{ 
                                                    backgroundColor: 'var(--color-background-subtle)',
                                                    border: '1px solid var(--color-border)'
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <IndianRupee className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                                                    <span className="text-xs font-medium" style={{ color: 'var(--color-foreground-muted)' }}>
                                                        Subsidy Amount
                                                    </span>
                                                </div>
                                                <p className="text-xl font-bold" style={{ color: 'var(--color-warning)' }}>
                                                    ₹{Number(eligibilityInfo?.Subsidy_Applied || scheme.Max_Subsidy_Amount).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            {eligible && eligibilityInfo && (
                                                <>
                                                    <div 
                                                        className="p-4 rounded-lg"
                                                        style={{ 
                                                            backgroundColor: 'var(--color-background-subtle)',
                                                            border: '1px solid var(--color-border)'
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                                                            <span className="text-xs font-medium" style={{ color: 'var(--color-foreground-muted)' }}>
                                                                Projected Revenue Boost
                                                            </span>
                                                        </div>
                                                        <p className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>
                                                            +{Number(eligibilityInfo.Revenue_Increase_Pct).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                    <div 
                                                        className="p-4 rounded-lg"
                                                        style={{ 
                                                            backgroundColor: 'var(--color-background-subtle)',
                                                            border: '1px solid var(--color-border)'
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Users className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                                            <span className="text-xs font-medium" style={{ color: 'var(--color-foreground-muted)' }}>
                                                                New Jobs Added
                                                            </span>
                                                        </div>
                                                        <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                                            +{eligibilityInfo.New_Jobs_Added}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {eligible && (
                                            <button
                                                className="mt-4 px-6 py-2.5 rounded-lg font-medium transition-all"
                                                style={{
                                                    backgroundColor: 'var(--color-success)',
                                                    color: 'white'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add to applications (would be handled by state/storage)
                                                    alert(`Application for ${scheme.Scheme_Name} submitted! Track it in the Applications tab.`);
                                                }}
                                            >
                                                Apply for this Scheme
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
