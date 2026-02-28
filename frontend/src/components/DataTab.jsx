import React, { useState, useEffect } from 'react';
import { Database, FileText, Download, Filter, Loader2 } from 'lucide-react';
import { loadCSV } from '../utils/csvParser';

export default function DataTab() {
    const [activeTable, setActiveTable] = useState('schemes');
    const [schemes, setSchemes] = useState([]);
    const [msme, setMsme] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [schemesData, msmeData] = await Promise.all([
                loadCSV('/data/schemes_data.csv'),
                loadCSV('/data/msme_data.csv')
            ]);
            setSchemes(schemesData);
            setMsme(msmeData);
            setLoading(false);
        }
        fetchData();
    }, []);

    const filteredSchemes = schemes.filter(s => 
        s.Scheme_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.Scheme_ID?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMsme = msme.filter(m =>
        m.MSME_ID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.Sector?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading datasets...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                        <h2 className="text-2xl font-bold">Dataset Explorer</h2>
                    </div>
                    <p className="max-w-xl" style={{ color: 'var(--color-foreground-muted)' }}>
                        Raw analytical view of MSME profiles and government schemes powering the simulation engine.
                    </p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-foreground)'
                        }}
                    />
                    <button 
                        className="p-2.5 rounded-lg transition-all hover:opacity-80"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTable('schemes')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                        backgroundColor: activeTable === 'schemes' ? 'var(--color-primary)' : 'var(--color-background-subtle)',
                        color: activeTable === 'schemes' ? 'white' : 'var(--color-foreground)',
                        border: activeTable === 'schemes' ? 'none' : '1px solid var(--color-border)'
                    }}
                >
                    <FileText className="w-4 h-4" />
                    Schemes
                </button>
                <button
                    onClick={() => setActiveTable('msme')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                        backgroundColor: activeTable === 'msme' ? 'var(--color-primary)' : 'var(--color-background-subtle)',
                        color: activeTable === 'msme' ? 'white' : 'var(--color-foreground)',
                        border: activeTable === 'msme' ? 'none' : '1px solid var(--color-border)'
                    }}
                >
                    <Database className="w-4 h-4" />
                    MSME Profiles
                </button>
            </div>

            {/* Schemes Table */}
            {activeTable === 'schemes' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Government Schemes</h3>
                        <span 
                            className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: 'var(--color-background-subtle)', color: 'var(--color-foreground-muted)' }}
                        >
                            {filteredSchemes.length} records
                        </span>
                    </div>
                    <div 
                        className="rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="min-w-full">
                                <thead style={{ backgroundColor: 'var(--color-background-subtle)', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Scheme Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Eligible Sectors</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Target Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Max Subsidy</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Revenue Impact</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Job Impact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchemes.map((s, i) => (
                                        <tr 
                                            key={i} 
                                            className="transition-colors hover:bg-white/5"
                                            style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{s.Scheme_ID}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">{s.Scheme_Name}</td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-foreground-muted)' }}>{s.Eligible_Sectors}</td>
                                            <td className="px-4 py-3 text-xs">{s.Target_Category}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    ₹{Number(s.Max_Subsidy_Amount).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-success)' }}>+{(Number(s.Impact_Factor_Revenue) * 100).toFixed(0)}%</td>
                                            <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-success)' }}>+{s.Impact_Factor_Employment}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MSME Profiles Table */}
            {activeTable === 'msme' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">MSME Profiles</h3>
                        <span 
                            className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: 'var(--color-background-subtle)', color: 'var(--color-foreground-muted)' }}
                        >
                            {filteredMsme.length} records
                        </span>
                    </div>
                    <div 
                        className="rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="min-w-full">
                                <thead style={{ backgroundColor: 'var(--color-background-subtle)', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Entity</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Sector</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Years</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Annual Revenue</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Employees</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Growth</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>GST Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMsme.slice(0, 100).map((m, i) => (
                                        <tr 
                                            key={i} 
                                            className="transition-colors hover:bg-white/5"
                                            style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                        >
                                            <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{m.MSME_ID}</td>
                                            <td className="px-4 py-3 text-xs uppercase" style={{ color: 'var(--color-foreground-muted)' }}>{m.Sector}</td>
                                            <td className="px-4 py-3 text-xs">
                                                <span 
                                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{ 
                                                        backgroundColor: m.Category === 'Micro' ? 'rgba(59, 130, 246, 0.2)' : m.Category === 'Small' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                        color: m.Category === 'Micro' ? 'var(--color-primary)' : m.Category === 'Small' ? 'var(--color-success)' : 'var(--color-warning)'
                                                    }}
                                                >
                                                    {m.Category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs uppercase" style={{ color: 'var(--color-foreground-muted)' }}>{m.Location_Type}</td>
                                            <td className="px-4 py-3 text-sm">{m.Years_of_Operation} yrs</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    ₹{(Number(m.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">{m.Number_of_Employees}</td>
                                            <td className="px-4 py-3 text-xs">
                                                <span 
                                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{ 
                                                        backgroundColor: m.Growth_Category === 'High' ? 'rgba(20, 184, 166, 0.2)' : m.Growth_Category === 'Moderate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        color: m.Growth_Category === 'High' ? 'var(--color-success)' : m.Growth_Category === 'Moderate' ? 'var(--color-warning)' : 'var(--color-error)'
                                                    }}
                                                >
                                                    {m.Growth_Category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-16 rounded-full h-1.5"
                                                        style={{ backgroundColor: 'var(--color-background-muted)' }}
                                                    >
                                                        <div 
                                                            className="h-1.5 rounded-full transition-all"
                                                            style={{ 
                                                                width: `${m.GST_Compliance_Score}%`,
                                                                backgroundColor: m.GST_Compliance_Score > 80 ? 'var(--color-success)' : m.GST_Compliance_Score > 60 ? 'var(--color-warning)' : 'var(--color-error)'
                                                            }}
                                                        />
                                                    </div>
                                                    <span 
                                                        className="text-xs font-semibold"
                                                        style={{ 
                                                            color: m.GST_Compliance_Score > 80 ? 'var(--color-success)' : m.GST_Compliance_Score > 60 ? 'var(--color-warning)' : 'var(--color-error)'
                                                        }}
                                                    >
                                                        {Number(m.GST_Compliance_Score).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {filteredMsme.length > 100 && (
                        <p className="text-sm text-center" style={{ color: 'var(--color-foreground-muted)' }}>
                            Showing 100 of {filteredMsme.length} records. Use search to filter.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
