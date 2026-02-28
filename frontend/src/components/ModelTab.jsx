import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Users, Loader2, ShieldCheck, BarChart2, Zap } from 'lucide-react';
import { loadCSV } from '../utils/csvParser';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ModelTab() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await loadCSV('/data/msme_predictions.csv');
            setPredictions(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    // Calculate model metrics from predictions data
    const calculateMetrics = () => {
        if (predictions.length === 0) return null;

        const total = predictions.length;
        const correct = predictions.filter(p => p.Growth_Category === p.Predicted_Growth_Category).length;
        const accuracy = (correct / total) * 100;

        // Calculate class-wise metrics
        const classes = ['High', 'Moderate', 'Low'];
        const classMetrics = classes.map(cls => {
            const actual = predictions.filter(p => p.Growth_Category === cls);
            const predicted = predictions.filter(p => p.Predicted_Growth_Category === cls);
            const truePositives = predictions.filter(p => p.Growth_Category === cls && p.Predicted_Growth_Category === cls).length;
            
            const precision = predicted.length > 0 ? (truePositives / predicted.length) * 100 : 0;
            const recall = actual.length > 0 ? (truePositives / actual.length) * 100 : 0;
            const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

            return { class: cls, precision, recall, f1, support: actual.length };
        });

        // Distribution data for chart
        const distribution = classes.map(cls => ({
            name: cls,
            actual: predictions.filter(p => p.Growth_Category === cls).length,
            predicted: predictions.filter(p => p.Predicted_Growth_Category === cls).length
        }));

        return { accuracy, classMetrics, distribution, total };
    };

    const metrics = calculateMetrics();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading model metrics...</span>
            </div>
        );
    }

    const pieColors = ['#14b8a6', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    <h2 className="text-2xl font-bold">Model Evaluation Report</h2>
                </div>
                <p className="max-w-xl" style={{ color: 'var(--color-foreground-muted)' }}>
                    Performance metrics for the MSME Growth Classification Model based on {metrics?.total || 0} predictions.
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div 
                    className="p-6 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)',
                        borderLeft: '4px solid var(--color-primary)'
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Accuracy</span>
                    </div>
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>
                        {metrics?.accuracy.toFixed(1)}%
                    </div>
                </div>

                <div 
                    className="p-6 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)',
                        borderLeft: '4px solid var(--color-success)'
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Macro F1</span>
                    </div>
                    <div className="text-3xl font-bold">
                        {metrics?.classMetrics ? (metrics.classMetrics.reduce((a, b) => a + b.f1, 0) / 3).toFixed(1) : 0}%
                    </div>
                </div>

                <div 
                    className="p-6 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)',
                        borderLeft: '4px solid var(--color-warning)'
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Total Samples</span>
                    </div>
                    <div className="text-3xl font-bold">{metrics?.total || 0}</div>
                </div>

                <div 
                    className="p-6 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)',
                        borderLeft: '4px solid var(--color-error)'
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4" style={{ color: 'var(--color-error)' }} />
                        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Classes</span>
                    </div>
                    <div className="text-3xl font-bold">3</div>
                    <div className="flex gap-1 mt-2">
                        {['High', 'Moderate', 'Low'].map(c => (
                            <span key={c} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background-subtle)' }}>{c}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution Chart */}
                <div 
                    className="p-6 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Actual vs Predicted Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.distribution || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-foreground-muted)" fontSize={12} />
                                <YAxis stroke="var(--color-foreground-muted)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--color-background-elevated)', 
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <Bar dataKey="actual" name="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="predicted" name="Predicted" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div 
                    className="p-6 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Growth Category Distribution</h3>
                    <div className="h-64 flex items-center">
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics?.distribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    dataKey="actual"
                                >
                                    {metrics?.distribution?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-3">
                            {metrics?.distribution?.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: pieColors[i] }} />
                                    <span className="text-sm">{item.name}: {item.actual}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Class-wise Metrics Table */}
            <div 
                className="rounded-xl overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-background-elevated)',
                    border: '1px solid var(--color-border)'
                }}
            >
                <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider">Classification Report</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead style={{ backgroundColor: 'var(--color-background-subtle)' }}>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Class</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Precision</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Recall</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>F1-Score</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-foreground-muted)' }}>Support</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics?.classMetrics?.map((m, i) => (
                                <tr 
                                    key={i} 
                                    className="transition-colors hover:bg-white/5"
                                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                                >
                                    <td className="px-4 py-3">
                                        <span 
                                            className="px-2 py-1 rounded-full text-xs font-medium"
                                            style={{ 
                                                backgroundColor: m.class === 'High' ? 'rgba(20, 184, 166, 0.2)' : m.class === 'Moderate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: m.class === 'High' ? 'var(--color-success)' : m.class === 'Moderate' ? 'var(--color-warning)' : 'var(--color-error)'
                                            }}
                                        >
                                            {m.class}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono">{m.precision.toFixed(2)}%</td>
                                    <td className="px-4 py-3 text-sm font-mono">{m.recall.toFixed(2)}%</td>
                                    <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-success)' }}>{m.f1.toFixed(2)}%</td>
                                    <td className="px-4 py-3 text-sm">{m.support}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Feature Importance */}
            <div 
                className="p-6 rounded-xl"
                style={{
                    backgroundColor: 'var(--color-background-elevated)',
                    border: '1px solid var(--color-border)'
                }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    <h3 className="text-sm font-semibold uppercase tracking-wider">Feature Importance (Predictive Drivers)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { name: 'Revenue Growth Rate', importance: 0.285 },
                        { name: 'Technology Level', importance: 0.198 },
                        { name: 'Capacity Utilization', importance: 0.156 },
                        { name: 'Profit Margin', importance: 0.142 },
                        { name: 'GST Compliance Score', importance: 0.108 },
                        { name: 'Export Percentage', importance: 0.068 },
                    ].map((feature, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span style={{ color: 'var(--color-foreground-muted)' }}>{feature.name}</span>
                                <span className="font-mono" style={{ color: 'var(--color-primary)' }}>{(feature.importance * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--color-background-muted)' }}>
                                <div 
                                    className="h-2 rounded-full transition-all"
                                    style={{ 
                                        width: `${feature.importance * 100 * 3}%`,
                                        backgroundColor: i === 0 ? 'var(--color-primary)' : i < 3 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.4)'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
