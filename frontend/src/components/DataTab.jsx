import React, { useState } from 'react';
import { Database, FileText, Download, Filter } from 'lucide-react';

// Mock data based on actual CSV files
const mockSchemes = [
    { Scheme_ID: 'SCH_001', Scheme_Name: 'Digital MSME Transformation Grant', Eligible_Sectors: 'IT Services, Manufacturing', Max_Subsidy_Amount: 500000, Target_Category: 'Micro, Small', Impact_Factor_Revenue: 0.15, Impact_Factor_Employment: 2 },
    { Scheme_ID: 'SCH_002', Scheme_Name: 'Green Tech Subsidy', Eligible_Sectors: 'Manufacturing, Textiles', Max_Subsidy_Amount: 1000000, Target_Category: 'Small, Medium', Impact_Factor_Revenue: 0.10, Impact_Factor_Employment: 5 },
    { Scheme_ID: 'SCH_003', Scheme_Name: 'Rural Employment Boost', Eligible_Sectors: 'Food Processing, Textiles', Max_Subsidy_Amount: 300000, Target_Category: 'Micro', Impact_Factor_Revenue: 0.05, Impact_Factor_Employment: 8 },
    { Scheme_ID: 'SCH_004', Scheme_Name: 'Export Excellence Incentive', Eligible_Sectors: 'Manufacturing, Textiles, Food Processing', Max_Subsidy_Amount: 2000000, Target_Category: 'Medium', Impact_Factor_Revenue: 0.25, Impact_Factor_Employment: 4 },
    { Scheme_ID: 'SCH_005', Scheme_Name: 'New Enterprise Support', Eligible_Sectors: 'All', Max_Subsidy_Amount: 200000, Target_Category: 'Micro', Impact_Factor_Revenue: 0.20, Impact_Factor_Employment: 3 },
];

const mockMsme = [
    { MSME_ID: 'MSME_0001', Sector: 'Textiles', Location_Type: 'Urban', Annual_Revenue: 8222922.70, Number_of_Employees: 37, GST_Compliance_Score: 98.79, Category: 'Micro' },
    { MSME_ID: 'MSME_0002', Sector: 'Textiles', Location_Type: 'Rural', Annual_Revenue: 849782.10, Number_of_Employees: 34, GST_Compliance_Score: 75.29, Category: 'Small' },
    { MSME_ID: 'MSME_0003', Sector: 'Retail', Location_Type: 'Urban', Annual_Revenue: 3720053.85, Number_of_Employees: 10, GST_Compliance_Score: 87.36, Category: 'Micro' },
    { MSME_ID: 'MSME_0004', Sector: 'Retail', Location_Type: 'Rural', Annual_Revenue: 19857500.07, Number_of_Employees: 73, GST_Compliance_Score: 98.78, Category: 'Medium' },
    { MSME_ID: 'MSME_0005', Sector: 'Textiles', Location_Type: 'Rural', Annual_Revenue: 10201151.68, Number_of_Employees: 101, GST_Compliance_Score: 71.23, Category: 'Medium' },
    { MSME_ID: 'MSME_0006', Sector: 'Retail', Location_Type: 'Urban', Annual_Revenue: 38726116.08, Number_of_Employees: 100, GST_Compliance_Score: 78.56, Category: 'Medium' },
    { MSME_ID: 'MSME_0007', Sector: 'Manufacturing', Location_Type: 'Urban', Annual_Revenue: 3646138.33, Number_of_Employees: 123, GST_Compliance_Score: 64.78, Category: 'Small' },
    { MSME_ID: 'MSME_0008', Sector: 'IT Services', Location_Type: 'Semi-Urban', Annual_Revenue: 2501462.68, Number_of_Employees: 82, GST_Compliance_Score: 72.57, Category: 'Small' },
];

export default function DataTab() {
    const [activeTable, setActiveTable] = useState('schemes');

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
                        className="p-2.5 rounded-lg transition-all hover:opacity-80"
                        style={{
                            backgroundColor: 'var(--color-background-subtle)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                        <Filter className="w-4 h-4" />
                        Filter
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
                            {mockSchemes.length} records
                        </span>
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
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Eligible Sectors</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Max Subsidy</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Revenue Impact</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Job Impact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockSchemes.map((s, i) => (
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
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    {parseFloat(s.Max_Subsidy_Amount).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-success)' }}>+{(s.Impact_Factor_Revenue * 100).toFixed(0)}%</td>
                                            <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-success)' }}>+{s.Impact_Factor_Employment}%</td>
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
                            {mockMsme.length} records
                        </span>
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
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Annual Revenue</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Employees</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>GST Compliance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockMsme.map((m, i) => (
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
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    {(parseFloat(m.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">{m.Number_of_Employees}</td>
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
                                                        {m.GST_Compliance_Score.toFixed(0)}%
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
            )}
        </div>
    );
}
