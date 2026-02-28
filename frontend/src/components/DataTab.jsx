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
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-foreground-muted text-sm">Loading datasets...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">Dataset Explorer</h2>
                    </div>
                    <p className="text-foreground-muted max-w-xl">
                        Raw analytical view of generated MSME profiles and government schemes powering the simulation engine.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary p-2.5">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="btn-primary">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Schemes Table */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Government Schemes</h3>
                </div>
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-background-subtle">
                                <tr>
                                    <th className="table-header">ID</th>
                                    <th className="table-header">Scheme Name</th>
                                    <th className="table-header">Max Subsidy</th>
                                    <th className="table-header">Revenue Impact</th>
                                    <th className="table-header">Job Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.schemes.map((s, i) => (
                                    <tr key={i} className="table-row">
                                        <td className="table-cell">
                                            <span className="font-semibold text-primary">{s.Scheme_ID}</span>
                                        </td>
                                        <td className="table-cell font-medium text-foreground">{s.Scheme_Name}</td>
                                        <td className="table-cell">
                                            <span className="font-semibold text-warning">
                                                {parseFloat(s.Max_Subsidy_Amount).toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="table-cell font-mono text-foreground-muted">{s.Impact_Factor_Revenue}x</td>
                                        <td className="table-cell font-mono text-foreground-muted">{s.Impact_Factor_Employment}%</td>
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
                    <Database className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">MSME Profiles (Sample)</h3>
                </div>
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-background-subtle">
                                <tr>
                                    <th className="table-header">Entity</th>
                                    <th className="table-header">Sector</th>
                                    <th className="table-header">Location</th>
                                    <th className="table-header">Annual Revenue</th>
                                    <th className="table-header">Employees</th>
                                    <th className="table-header">Compliance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.msme.map((m, i) => (
                                    <tr key={i} className="table-row">
                                        <td className="table-cell font-semibold text-foreground">{m.MSME_ID}</td>
                                        <td className="table-cell text-xs text-foreground-muted uppercase">{m.Sector}</td>
                                        <td className="table-cell text-xs text-foreground-muted uppercase">{m.Location_Type}</td>
                                        <td className="table-cell">
                                            <span className="font-semibold text-warning">
                                                {(parseFloat(m.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                            </span>
                                        </td>
                                        <td className="table-cell text-foreground">{m.Number_of_Employees}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-background-muted rounded-full h-1.5">
                                                    <div 
                                                        className="bg-primary h-1.5 rounded-full transition-all" 
                                                        style={{ width: `${m.GST_Compliance_Score}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-primary">
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
