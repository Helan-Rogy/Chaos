import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, ShieldCheck, BarChart2, Zap, Terminal, Loader2 } from 'lucide-react';

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
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-foreground-muted text-sm">Loading model metrics...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-muted rounded-lg">
                        <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">AI Model Metrics</h2>
                </div>
                <p className="text-foreground-muted max-w-2xl">
                    Random Forest Classifier analyzing multi-dimensional feature variance to categorize MSME growth trajectories.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metrics Cards */}
                <div className="space-y-4">
                    <div className="metric-card border-l-4 border-l-success">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            <span className="metric-label">Model Precision</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-foreground">0.96</span>
                            <span className="text-success text-sm font-medium font-mono">Macro F1</span>
                        </div>
                        <p className="text-xs text-foreground-subtle mt-2">Optimized for classification imbalance</p>
                    </div>

                    <div className="metric-card border-l-4 border-l-primary">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="metric-label">Primary Target</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Growth_Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {['High', 'Moderate', 'Low'].map(cat => (
                                <span key={cat} className="badge badge-neutral text-xs">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5 bg-primary-muted border-primary/20">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-foreground">Predictive Drivers</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-foreground-muted">Revenue Growth Rate</span>
                                    <span className="text-primary font-medium">Dominant</span>
                                </div>
                                <div className="w-full bg-background-muted rounded-full h-1.5">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-foreground-muted">Tech Proficiency</span>
                                    <span className="text-primary font-medium">High</span>
                                </div>
                                <div className="w-full bg-background-muted rounded-full h-1.5">
                                    <div className="bg-primary/60 h-1.5 rounded-full" style={{ width: '65%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-foreground-muted">Market Stability</span>
                                    <span className="text-foreground-subtle font-medium">Medium</span>
                                </div>
                                <div className="w-full bg-background-muted rounded-full h-1.5">
                                    <div className="bg-primary/40 h-1.5 rounded-full" style={{ width: '45%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terminal Panel */}
                <div className="lg:col-span-2">
                    <div className="card overflow-hidden h-full flex flex-col">
                        <div className="bg-background-subtle border-b border-border px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-primary" />
                                <span className="text-xs font-mono text-foreground-muted">evaluation_logs / growth_model.rf</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                                <div className="w-3 h-3 rounded-full bg-warning/50" />
                                <div className="w-3 h-3 rounded-full bg-success/50" />
                            </div>
                        </div>
                        <div className="p-6 flex-grow overflow-auto max-h-[500px] bg-background font-mono">
                            <pre className="text-sm text-primary leading-relaxed whitespace-pre-wrap selection:bg-primary selection:text-white">
                                {metrics || "ERROR: Log file 'reports/phase2_evaluation.txt' not found. Run engine/growth_model.py first."}
                            </pre>
                        </div>
                        <div className="bg-background-elevated px-4 py-2.5 border-t border-border flex justify-between items-center">
                            <span className="text-xs font-mono text-foreground-subtle">SESSION: RF-2026.4</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
                                <span className="text-xs font-mono text-foreground-subtle">CONNECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
