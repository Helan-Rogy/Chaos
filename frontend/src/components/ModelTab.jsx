import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, Target, Loader2, Terminal } from 'lucide-react';

export default function ModelTab() {
    const [metrics, setMetrics] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/metrics');
                setMetrics(response.data.content);
            } catch (err) {
                setError(err.message || "Failed to load model evaluation metrics.");
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
            <p className="mt-4 text-secondary-400 font-medium">Loading model metrics...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">AI Model Performance</h2>
                <p className="text-secondary-400">Random Forest Classifier for MSME growth prediction</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-secondary-400">Model Accuracy</h3>
                        <TrendingUp className="h-5 w-5 text-success-500" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">96%</p>
                    <p className="text-xs text-secondary-500">Macro F1-Score</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-secondary-400">Target Variable</h3>
                        <Target className="h-5 w-5 text-primary-500" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">Growth Category</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="badge badge-success">High</span>
                        <span className="badge badge-warning">Moderate</span>
                        <span className="badge badge-error">Low</span>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-secondary-400">Algorithm</h3>
                        <Brain className="h-5 w-5 text-primary-500" />
                    </div>
                    <p className="text-xl font-bold text-white mb-2">Random Forest</p>
                    <p className="text-xs text-secondary-500">Ensemble classifier with hyperparameter tuning</p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="bg-secondary-900 px-6 py-4 border-b border-secondary-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-semibold text-secondary-200">Evaluation Report</span>
                    </div>
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-error-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-warning-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-success-500/50"></div>
                    </div>
                </div>
                <div className="p-6 bg-secondary-900/50 overflow-auto max-h-[600px]">
                    <pre className="text-sm text-secondary-200 font-mono leading-relaxed whitespace-pre-wrap">
                        {metrics || "Error: Model evaluation report not found. Please run engine/growth_model.py to generate metrics."}
                    </pre>
                </div>
            </div>

            <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-secondary-300">Revenue Growth Rate</span>
                                <span className="text-primary-400 font-semibold">High Impact</span>
                            </div>
                            <div className="w-full bg-secondary-700 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-secondary-300">Technology Level</span>
                                <span className="text-primary-400 font-semibold">Medium Impact</span>
                            </div>
                            <div className="w-full bg-secondary-700 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-secondary-300">GST Compliance Score</span>
                                <span className="text-primary-400 font-semibold">Medium Impact</span>
                            </div>
                            <div className="w-full bg-secondary-700 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-secondary-300">Capacity Utilization</span>
                                <span className="text-primary-400 font-semibold">Low Impact</span>
                            </div>
                            <div className="w-full bg-secondary-700 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
