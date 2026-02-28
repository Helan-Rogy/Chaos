import React, { useState } from 'react';
import { Search, MapPin, Building, Star, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

// Mock MSME data with predictions
const mockMsmeData = [
    { 
        MSME_ID: 'MSME_0001', Sector: 'Textiles', Location_Type: 'Urban', Category: 'Micro',
        Annual_Revenue: 8222922.70, GST_Compliance_Score: 98.79, Growth_Score: 78,
        Predicted_Growth_Category: 'High', Number_of_Employees: 37
    },
    { 
        MSME_ID: 'MSME_0003', Sector: 'Retail', Location_Type: 'Urban', Category: 'Micro',
        Annual_Revenue: 3720053.85, GST_Compliance_Score: 87.36, Growth_Score: 82,
        Predicted_Growth_Category: 'High', Number_of_Employees: 10
    },
    { 
        MSME_ID: 'MSME_0007', Sector: 'Manufacturing', Location_Type: 'Urban', Category: 'Small',
        Annual_Revenue: 3646138.33, GST_Compliance_Score: 64.78, Growth_Score: 45,
        Predicted_Growth_Category: 'Moderate', Number_of_Employees: 123
    },
    { 
        MSME_ID: 'MSME_0008', Sector: 'IT Services', Location_Type: 'Semi-Urban', Category: 'Small',
        Annual_Revenue: 2501462.68, GST_Compliance_Score: 72.57, Growth_Score: 56,
        Predicted_Growth_Category: 'Moderate', Number_of_Employees: 82
    },
    { 
        MSME_ID: 'MSME_0012', Sector: 'Manufacturing', Location_Type: 'Semi-Urban', Category: 'Small',
        Annual_Revenue: 14292999.97, GST_Compliance_Score: 76.41, Growth_Score: 88,
        Predicted_Growth_Category: 'High', Number_of_Employees: 87
    },
    { 
        MSME_ID: 'MSME_0005', Sector: 'Textiles', Location_Type: 'Rural', Category: 'Medium',
        Annual_Revenue: 10201151.68, GST_Compliance_Score: 71.23, Growth_Score: 32,
        Predicted_Growth_Category: 'Low', Number_of_Employees: 101
    },
];

// Mock schemes for each MSME
const mockSchemes = {
    'MSME_0001': [
        { Scheme_ID: 'SCH_001', Scheme_Name: 'Digital MSME Transformation Grant', is_recommended: true, expected_revenue_boost: 823000, expected_job_creation: 4, Max_Subsidy_Amount: 500000 },
        { Scheme_ID: 'SCH_002', Scheme_Name: 'Green Tech Subsidy', is_recommended: false, expected_revenue_boost: 411000, expected_job_creation: 2, Max_Subsidy_Amount: 1000000 },
    ],
    'MSME_0003': [
        { Scheme_ID: 'SCH_005', Scheme_Name: 'New Enterprise Support', is_recommended: true, expected_revenue_boost: 372000, expected_job_creation: 2, Max_Subsidy_Amount: 200000 },
    ],
    'MSME_0007': [
        { Scheme_ID: 'SCH_001', Scheme_Name: 'Digital MSME Transformation Grant', is_recommended: true, expected_revenue_boost: 547000, expected_job_creation: 6, Max_Subsidy_Amount: 500000 },
        { Scheme_ID: 'SCH_004', Scheme_Name: 'Export Excellence Incentive', is_recommended: false, expected_revenue_boost: 912000, expected_job_creation: 4, Max_Subsidy_Amount: 2000000 },
    ],
    'MSME_0008': [
        { Scheme_ID: 'SCH_001', Scheme_Name: 'Digital MSME Transformation Grant', is_recommended: true, expected_revenue_boost: 375000, expected_job_creation: 3, Max_Subsidy_Amount: 500000 },
    ],
    'MSME_0012': [
        { Scheme_ID: 'SCH_004', Scheme_Name: 'Export Excellence Incentive', is_recommended: true, expected_revenue_boost: 3573000, expected_job_creation: 8, Max_Subsidy_Amount: 2000000 },
        { Scheme_ID: 'SCH_001', Scheme_Name: 'Digital MSME Transformation Grant', is_recommended: false, expected_revenue_boost: 2144000, expected_job_creation: 4, Max_Subsidy_Amount: 500000 },
    ],
    'MSME_0005': [
        { Scheme_ID: 'SCH_003', Scheme_Name: 'Rural Employment Boost', is_recommended: true, expected_revenue_boost: 510000, expected_job_creation: 8, Max_Subsidy_Amount: 300000 },
    ],
};

export default function AdvisoryTab() {
    const [query, setQuery] = useState("");
    const [expandedMsme, setExpandedMsme] = useState(null);

    const filteredResults = mockMsmeData.filter(item => {
        if (!query) return true;
        const q = query.toLowerCase();
        return item.MSME_ID.toLowerCase().includes(q) ||
            item.Sector.toLowerCase().includes(q) ||
            item.Location_Type.toLowerCase().includes(q) ||
            item.Category.toLowerCase().includes(q) ||
            item.Predicted_Growth_Category.toLowerCase().includes(q);
    });

    const toggleMsme = (msmeId) => {
        setExpandedMsme(expandedMsme === msmeId ? null : msmeId);
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
                            onClick={() => setQuery(tag === 'High Growth' ? 'High' : tag)}
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
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4 min-h-[300px]">
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
                        {filteredResults.map((item) => (
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
                                {expandedMsme === item.MSME_ID && mockSchemes[item.MSME_ID] && (
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {mockSchemes[item.MSME_ID].map((scheme) => (
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

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue Boost</p>
                                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                                                                +{formatCurrency(scheme.expected_revenue_boost)}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-subtle)' }}>Jobs Created</p>
                                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                                                                +{scheme.expected_job_creation}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-subtle)' }}>Max Subsidy</p>
                                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                                {formatCurrency(scheme.Max_Subsidy_Amount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
