import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, FileText, Download, Filter, Loader2 } from 'lucide-react';

export default function DataTab() {
    const [data, setData] = useState({ msme: [], schemes: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/data');
                setData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>Loading datasets...</p>
        </div>
    );

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
                        Raw analytical view of generated MSME profiles and government schemes powering the simulation engine.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        className="p-2.5 rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Schemes Table */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                    <h3 className="text-sm font-semibold uppercase tracking-wider">Government Schemes</h3>
                </div>
                <div 
                    className="rounded-xl overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead style={{ backgroundColor: 'var(--color-background-subtle)' }}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Scheme Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Max Subsidy</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Revenue Impact</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Job Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.schemes.map((s, i) => (
                                    <tr 
                                        key={i} 
                                        className="transition-colors"
                                        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                    >
                                        <td className="px-4 py-3 text-sm">
                                            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{s.Scheme_ID}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">{s.Scheme_Name}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                {parseFloat(s.Max_Subsidy_Amount).toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-foreground-muted)' }}>{s.Impact_Factor_Revenue}x</td>
                                        <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-foreground-muted)' }}>{s.Impact_Factor_Employment}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MSME Profiles Table */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    <h3 className="text-sm font-semibold uppercase tracking-wider">MSME Profiles (Sample)</h3>
                </div>
                <div 
                    className="rounded-xl overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead style={{ backgroundColor: 'var(--color-background-subtle)' }}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Entity</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Sector</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Annual Revenue</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Employees</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Compliance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.msme.map((m, i) => (
                                    <tr 
                                        key={i} 
                                        className="transition-colors"
                                        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                    >
                                        <td className="px-4 py-3 text-sm font-semibold">{m.MSME_ID}</td>
                                        <td className="px-4 py-3 text-xs uppercase" style={{ color: 'var(--color-foreground-muted)' }}>{m.Sector}</td>
                                        <td className="px-4 py-3 text-xs uppercase" style={{ color: 'var(--color-foreground-muted)' }}>{m.Location_Type}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                {(parseFloat(m.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{m.Number_of_Employees}</td>
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
                                                            backgroundColor: 'var(--color-primary)'
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                                                    {m.GST_Compliance_Score.toFixed(0)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
