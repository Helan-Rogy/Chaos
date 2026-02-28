import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, FileText, Loader2 } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
            <p className="mt-4 text-secondary-400 font-medium">Loading data...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Data Explorer</h2>
                <p className="text-secondary-400">View synthetic MSME profiles and scheme definitions</p>
            </div>

            <div className="card p-6">
                <div className="flex items-center mb-6">
                    <FileText className="w-5 h-5 mr-3 text-primary-500" />
                    <h3 className="text-lg font-semibold text-white">Government Schemes</h3>
                    <span className="ml-auto text-sm text-secondary-400">{data.schemes.length} schemes</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Scheme ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Max Subsidy</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Revenue Impact</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Job Impact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-700/50">
                            {data.schemes.map((s, i) => (
                                <tr key={i} className="hover:bg-secondary-700/30">
                                    <td className="px-4 py-3 text-sm font-semibold text-primary-400">{s.Scheme_ID}</td>
                                    <td className="px-4 py-3 text-sm text-white">{s.Scheme_Name}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-success-500">
                                        ₹{parseFloat(s.Max_Subsidy_Amount).toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-secondary-300">{s.Impact_Factor_Revenue}x</td>
                                    <td className="px-4 py-3 text-sm text-secondary-300">{s.Impact_Factor_Employment}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card p-6">
                <div className="flex items-center mb-6">
                    <Database className="w-5 h-5 mr-3 text-primary-500" />
                    <h3 className="text-lg font-semibold text-white">MSME Profiles</h3>
                    <span className="ml-auto text-sm text-secondary-400">{data.msme.length} records (sample)</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">MSME ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Sector</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Location</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Annual Revenue</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Employees</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Compliance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-700/50">
                            {data.msme.map((m, i) => (
                                <tr key={i} className="hover:bg-secondary-700/30">
                                    <td className="px-4 py-3 text-sm font-semibold text-white">{m.MSME_ID}</td>
                                    <td className="px-4 py-3 text-sm text-secondary-300">{m.Sector}</td>
                                    <td className="px-4 py-3 text-sm text-secondary-300">{m.Location_Type}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-success-500">
                                        ₹{(parseFloat(m.Annual_Revenue) / 10000000).toFixed(2)} Cr
                                    </td>
                                    <td className="px-4 py-3 text-sm text-secondary-300">{m.Number_of_Employees}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-secondary-700 rounded-full h-1.5">
                                                <div
                                                    className="bg-primary-600 h-1.5 rounded-full"
                                                    style={{ width: `${m.GST_Compliance_Score}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold text-secondary-300">
                                                {parseFloat(m.GST_Compliance_Score).toFixed(0)}%
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
    );
}
