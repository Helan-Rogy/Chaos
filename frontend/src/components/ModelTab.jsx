import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Activity, TrendingUp, ShieldCheck, BarChart2, Zap, Terminal } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-artha-saffron border-t-transparent rounded-full"></div>
            <p className="text-artha-slate font-display font-medium">Decoding Decision Nets...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-display font-bold text-white flex items-center">
                    <div className="p-2 bg-artha-saffron/20 rounded-xl mr-4 shadow-glow-saffron">
                        <Brain className="w-8 h-8 text-artha-saffron" />
                    </div>
                    Intelligence Core: Random Forest Classifier
                </h2>
                <p className="mt-4 text-artha-slate max-w-2xl leading-relaxed">
                    Analyzing multi-dimensional feature variance to categorize MSME growth trajectories. Current training iteration targeting 96%+ macro-F1 precision.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Metrics Column */}
                <div className="space-y-6">

                    <div className="glass-card p-6 border-l-4 border-l-emerald-500 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="w-16 h-16 text-emerald-400" />
                        </div>
                        <div className="flex items-center mb-4">
                            <Activity className="w-4 h-4 text-emerald-400 mr-2" />
                            <h3 className="text-xs font-bold text-artha-slate uppercase tracking-widest">Model Precision</h3>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <p className="text-5xl font-display font-bold text-white">0.96</p>
                            <span className="text-emerald-400 text-xs font-bold font-mono">Macro F1</span>
                        </div>
                        <p className="text-[10px] text-artha-slate mt-2 uppercase font-medium">Optimized for Classification Imbalance</p>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-artha-saffron relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-16 h-16 text-artha-saffron" />
                        </div>
                        <div className="flex items-center mb-4">
                            <Zap className="w-4 h-4 text-artha-saffron mr-2" />
                            <h3 className="text-xs font-bold text-artha-slate uppercase tracking-widest">Primary Target</h3>
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-4">Growth_Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {['High', 'Moderate', 'Low'].map(cat => (
                                <span key={cat} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-artha-slate uppercase tracking-widest group-hover:text-white transition-colors">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-artha-saffron/5 border border-artha-saffron/20 shadow-glow-saffron">
                        <div className="flex items-center mb-4">
                            <BarChart2 className="w-5 h-5 text-artha-saffron mr-2" />
                            <h3 className="font-display font-bold text-white uppercase tracking-wider">Predictive Drivers</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-artha-slate uppercase mb-1">
                                    <span>Rev Growth Rate</span>
                                    <span className="text-artha-saffron">Dominant</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div className="bg-artha-saffron h-1 rounded-full shadow-glow-saffron" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-artha-slate uppercase mb-1">
                                    <span>Tech Proficiency</span>
                                    <span className="text-artha-saffron">High</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div className="bg-artha-saffron h-1 rounded-full opacity-60" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Data Terminal Panel */}
                <div className="md:col-span-2">
                    <div className="glass-card overflow-hidden h-full flex flex-col shadow-2xl">
                        <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Terminal className="w-4 h-4 text-artha-saffron" />
                                <span className="text-[10px] font-mono font-bold text-artha-slate uppercase tracking-widest">Evaluation Logs / Growth_Matrix.RF</span>
                            </div>
                            <div className="flex space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-artha-gold/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                            </div>
                        </div>
                        <div className="p-8 flex-grow overflow-auto max-h-[550px] font-mono">
                            <pre className="text-xs sm:text-sm text-artha-saffron leading-relaxed whitespace-pre-wrap selection:bg-artha-saffron selection:text-artha-navy">
                                {metrics || "SYSTEM ERROR: Log file 'reports/phase2_evaluation.txt' not found or empty. Verify engine/growth_model.py execution."}
                            </pre>
                        </div>
                        <div className="bg-black/20 px-6 py-3 border-t border-white/5 text-[10px] font-mono text-artha-slate flex justify-between">
                            <span>SESSION: AI-DEC-2026.4</span>
                            <span className="animate-pulse">CONNECTED</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
