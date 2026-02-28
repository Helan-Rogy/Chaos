import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, FileText, Download, Filter, Search } from 'lucide-react';

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
            <div className="animate-spin h-10 w-10 border-4 border-artha-saffron border-t-transparent rounded-full"></div>
            <p className="text-artha-slate font-display font-medium">Mounting Data Volumes...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white flex items-center">
                        <Database className="w-8 h-8 mr-4 text-artha-saffron" />
                        Synthetic Dataset Explorer
                    </h2>
                    <p className="mt-2 text-artha-slate max-w-xl">
                        A raw analytical view of the generated MSME financial profiles and governing schemas powering the simulation engine.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white/5 border border-white/10 text-white p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <Download className="w-5 h-5" />
                    </button>
                    <button className="premium-button flex items-center">
                        <Filter className="w-4 h-4 mr-2" /> Filter Matrix
                    </button>
                </div>
            </div>

            {/* Schemes Matrix */}
            <div className="space-y-6">
                <div className="flex items-center px-2">
                    <FileText className="w-5 h-5 mr-3 text-artha-gold" />
                    <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">Government Scheme Definitions</h3>
                </div>
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/5">
                            <thead className="bg-white/[0.02]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Scheme Name</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Cap (Max)</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Rev Impact</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Job Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {data.schemes.map((s, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-artha-saffron">{s.Scheme_ID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{s.Scheme_Name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-artha-gold font-bold">₹{parseFloat(s.Max_Subsidy_Amount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-artha-slate font-mono">{s.Impact_Factor_Revenue}x</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-artha-slate font-mono">{s.Impact_Factor_Employment}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MSME Profiles */}
            <div className="space-y-6">
                <div className="flex items-center px-2">
                    <Database className="w-5 h-5 mr-3 text-artha-saffron" />
                    <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">MSME Financial Profiles (Sample)</h3>
                </div>
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/5">
                            <thead className="bg-white/[0.02]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Entity</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Sector</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Location</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Annual Rev</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Team Size</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-artha-slate uppercase tracking-widest">Compliance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {data.msme.map((m, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{m.MSME_ID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-artha-slate uppercase">{m.Sector}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-artha-slate uppercase">{m.Location_Type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-artha-gold">
                                            ₹{(parseFloat(m.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{m.Number_of_Employees}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-white/5 rounded-full h-1 mr-2">
                                                    <div className="bg-artha-saffron h-1 rounded-full" style={{ width: `${m.GST_Compliance_Score}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-artha-saffron">{m.GST_Compliance_Score.toFixed(0)}</span>
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
