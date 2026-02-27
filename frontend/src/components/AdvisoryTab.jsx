import React, { useState } from 'react';
import { Search, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdvisoryTab() {
    const [msmeId, setMsmeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!msmeId) return;

        setLoading(true);
        // In a real app we'd fetch from backend. For now, mocking the response
        // based on our Phase 2 & 3 outputs for demonstration
        setTimeout(() => {
            setResult({
                id: msmeId,
                sector: 'Manufacturing',
                category: 'Micro',
                location: 'Rural',
                revenue: '₹82,22,922',
                employees: 37,
                prediction: {
                    category: 'High Growth',
                    score: 84.5
                },
                schemes: [
                    {
                        id: 'SCH_005',
                        name: 'New Enterprise Support',
                        subsidy: '₹2,00,000',
                        revLift: '2.43%',
                        jobsLift: '+1 Job',
                        recommended: true
                    },
                    {
                        id: 'SCH_003',
                        name: 'Rural Employment Boost',
                        subsidy: '₹3,00,000',
                        revLift: '3.64%',
                        jobsLift: '+4 Jobs',
                        recommended: false
                    }
                ]
            });
            setLoading(false);
        }, 600);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    MSME Advisory Interface
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Search for an MSME to view its growth prediction and recommended funding schemes.
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl">
                <label htmlFor="search" className="mb-2 text-sm font-medium text-slate-900 sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="search"
                        id="search"
                        className="block w-full p-4 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter MSME_ID (e.g. MSME_0042)..."
                        value={msmeId}
                        onChange={(e) => setMsmeId(e.target.value)}
                        required
                    />
                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-4 py-2 transition">
                        {loading ? 'Searching...' : 'Analyze'}
                    </button>
                </div>
            </form>

            {/* Results Area */}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300 mt-8">

                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-slate-900">Profile: {result.id}</h3>
                        </div>
                        <div className="p-6">
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500">Sector</dt>
                                    <dd className="mt-1 text-sm text-slate-900 font-semibold">{result.sector}</dd>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Category</dt>
                                        <dd className="mt-1 text-sm text-slate-900">{result.category}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Location</dt>
                                        <dd className="mt-1 text-sm text-slate-900">{result.location}</dd>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Annual Revenue</dt>
                                        <dd className="mt-1 text-lg font-semibold text-emerald-600">{result.revenue}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Employees</dt>
                                        <dd className="mt-1 text-lg font-semibold text-blue-600">{result.employees}</dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Prediction Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-indigo-900">Phase 2 AI Prediction</h3>
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-slate-500 mb-1">Predicted Growth Category:</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                    {result.prediction.category}
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-slate-500">Growth Score (0-100)</span>
                                    <span className="text-indigo-600">{result.prediction.score}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${result.prediction.score}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 italic">
                                    *Score based on Random Forest classification probabilities.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Schemes Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:col-span-3">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-slate-900">Phase 3 Scheme Eligibility & Impact</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Eligible Scheme</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Projected Subsidy</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue Lift</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Jobs Lift</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Recommendation</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {result.schemes.map((scheme, idx) => (
                                        <tr key={idx} className={scheme.recommended ? 'bg-indigo-50/50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {scheme.name} <span className="text-slate-400 text-xs ml-2">({scheme.id})</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                                                {scheme.subsidy}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    +{scheme.revLift}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    {scheme.jobsLift}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                {scheme.recommended ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Top ROI
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs text-center w-full block">—</span>
                                                )}
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
