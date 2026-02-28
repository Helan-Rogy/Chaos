import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Settings, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function PolicyTab() {
    const [budget, setBudget] = useState(50000000);
    const [alpha, setAlpha] = useState(0.6);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchSimulation = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/optimize', {
                budget,
                alpha
            });
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.details || err.message || "Failed to fetch simulation");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimulation();
    }, []);

    const beta = Math.round((1 - alpha) * 10) / 10;

    const getChartData = () => {
        if (!data || !data.selected) return [];
        const sectorMap = {};
        data.selected.forEach(row => {
            const s = row.Sector;
            if (!sectorMap[s]) sectorMap[s] = 0;
            sectorMap[s] += row.Subsidy_Applied;
        });
        return Object.keys(sectorMap).map(sector => ({
            name: sector,
            Budget: sectorMap[sector]
        })).sort((a, b) => b.Budget - a.Budget);
    };

    const chartData = getChartData();
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Policy Optimization Engine</h2>
                <p className="text-secondary-400">Simulate budget allocation strategies and optimize MSME funding decisions</p>
            </div>

            <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-200 mb-3">
                            Total Budget: <span className="text-primary-400">{formatCurrency(budget)}</span>
                        </label>
                        <input
                            type="range"
                            min="10000000"
                            max="200000000"
                            step="5000000"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            className="w-full h-2 bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-xs text-secondary-500 mt-1">
                            <span>₹1 Cr</span>
                            <span>₹20 Cr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-200 mb-3">
                            Policy Priority Balance
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={alpha}
                            onChange={(e) => setAlpha(parseFloat(e.target.value))}
                            className="w-full h-2 bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between items-center mt-3 gap-4">
                            <div className="flex-1 text-center">
                                <p className="text-xs text-secondary-400 mb-1">Employment</p>
                                <p className={`text-lg font-bold ${beta > 0.5 ? 'text-primary-400' : 'text-secondary-500'}`}>{beta}</p>
                            </div>
                            <div className="w-px h-10 bg-secondary-700"></div>
                            <div className="flex-1 text-center">
                                <p className="text-xs text-secondary-400 mb-1">Revenue</p>
                                <p className={`text-lg font-bold ${alpha > 0.5 ? 'text-primary-400' : 'text-secondary-500'}`}>{alpha}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={fetchSimulation}
                    disabled={loading}
                    className="btn-primary w-full md:w-auto"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Running Simulation...
                        </>
                    ) : (
                        <>
                            <Settings className="w-4 h-4 mr-2" />
                            Run Optimization
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/20 p-4 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-error-500 mr-3 flex-shrink-0" />
                    <p className="text-sm text-error-500">{error}</p>
                </div>
            )}

            {data && !loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-secondary-400">Budget Used</h3>
                                <TrendingUp className="h-5 w-5 text-primary-500" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{data.utilization_pct.toFixed(1)}%</p>
                            <div className="w-full bg-secondary-700 rounded-full h-2 mt-3">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${data.utilization_pct}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-secondary-400">MSMEs Funded</h3>
                                <CheckCircle2 className="h-5 w-5 text-success-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">{data.total_selected}</p>
                            <p className="text-sm text-secondary-500 mt-2">Enterprises approved</p>
                        </div>

                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-secondary-400">Jobs Created</h3>
                                <Users className="h-5 w-5 text-success-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">+{Math.round(data.total_jobs_created)}</p>
                            <p className="text-sm text-secondary-500 mt-2">New employment</p>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Sectoral Budget Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => [formatCurrency(value), 'Allocated']}
                                    />
                                    <Bar dataKey="Budget" fill="#0284c7" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center mb-4">
                            <CheckCircle2 className="h-5 w-5 text-success-500 mr-2" />
                            <h3 className="text-lg font-semibold text-white">Selected MSMEs</h3>
                            <span className="ml-auto text-sm text-secondary-400">{data.selected.length} funded</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-secondary-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Rank</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">MSME ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Scheme</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Subsidy</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Justification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-700/50">
                                    {data.selected.slice(0, 20).map((row, i) => (
                                        <tr key={i} className="hover:bg-secondary-700/30">
                                            <td className="px-4 py-3 text-sm font-semibold text-primary-400">#{row.Selection_Rank}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-white">{row.MSME_ID}</td>
                                            <td className="px-4 py-3 text-xs text-secondary-300">{row.Scheme_Name}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-success-500">{formatCurrency(row.Subsidy_Applied)}</td>
                                            <td className="px-4 py-3 text-xs text-secondary-400 max-w-md truncate">{row.Decision_Justification}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {data.unselected && data.unselected.length > 0 && (
                        <div className="card p-6">
                            <div className="flex items-center mb-4">
                                <XCircle className="h-5 w-5 text-error-500 mr-2" />
                                <h3 className="text-lg font-semibold text-white">Excluded MSMEs</h3>
                                <span className="ml-auto text-sm text-secondary-400">{data.unselected.length} not funded</span>
                            </div>
                            <div className="overflow-x-auto max-h-64">
                                <table className="min-w-full divide-y divide-secondary-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">MSME ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Scheme</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-secondary-400">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-700/50">
                                        {data.unselected.slice(0, 15).map((row, i) => (
                                            <tr key={i} className="hover:bg-secondary-700/30">
                                                <td className="px-4 py-3 text-sm text-secondary-300">{row.MSME_ID}</td>
                                                <td className="px-4 py-3 text-xs text-secondary-400">{row.Scheme_Name}</td>
                                                <td className="px-4 py-3 text-xs text-error-500">{row.Reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
