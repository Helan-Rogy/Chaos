import React from 'react';
import { Brain, TrendingUp, ShieldCheck, BarChart2, Zap, Terminal } from 'lucide-react';

// Mock metrics data
const mockMetrics = `
================================================================================
                    GROWTH MODEL EVALUATION REPORT
================================================================================

Model: Random Forest Classifier
Target: Growth_Category (High, Moderate, Low)
Training Set: 70% | Test Set: 30%
Features: 15 multi-dimensional indicators

--------------------------------------------------------------------------------
                         CLASSIFICATION REPORT
--------------------------------------------------------------------------------

              precision    recall  f1-score   support

        High       0.97      0.96      0.97       412
        Low        0.95      0.97      0.96       398
    Moderate       0.96      0.94      0.95       390

    accuracy                           0.96      1200
   macro avg       0.96      0.96      0.96      1200
weighted avg       0.96      0.96      0.96      1200

--------------------------------------------------------------------------------
                         FEATURE IMPORTANCE
--------------------------------------------------------------------------------

Revenue_Growth_Rate          ████████████████████  0.285
Technology_Level             ████████████████      0.198
Capacity_Utilization         ███████████████       0.156
Profit_Margin                █████████████         0.142
GST_Compliance_Score         ████████████          0.108
Export_Percentage            █████████             0.068
Number_of_Employees          ████████              0.043

--------------------------------------------------------------------------------
                         MODEL PERFORMANCE
--------------------------------------------------------------------------------

Cross-Validation Score (5-fold): 0.954 ± 0.012
ROC-AUC Score: 0.989
Precision @ 90% Recall: 0.923

================================================================================
                    END OF EVALUATION REPORT
================================================================================
`;

export default function ModelTab() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: 'var(--color-primary-muted)' }}
                    >
                        <Brain className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h2 className="text-2xl font-bold">AI Model Metrics</h2>
                </div>
                <p className="max-w-2xl" style={{ color: 'var(--color-foreground-muted)' }}>
                    Random Forest Classifier analyzing multi-dimensional feature variance to categorize MSME growth trajectories.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metrics Cards */}
                <div className="space-y-4">
                    <div 
                        className="p-5 rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)',
                            borderLeft: '4px solid var(--color-success)'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-foreground-subtle)' }}>Model Precision</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">0.96</span>
                            <span className="text-sm font-medium font-mono" style={{ color: 'var(--color-success)' }}>Macro F1</span>
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-foreground-subtle)' }}>Optimized for classification imbalance</p>
                    </div>

                    <div 
                        className="p-5 rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)',
                            borderLeft: '4px solid var(--color-primary)'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-foreground-subtle)' }}>Primary Target</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-3">Growth_Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {['High', 'Moderate', 'Low'].map(cat => (
                                <span 
                                    key={cat} 
                                    className="px-2.5 py-1 rounded-md text-xs font-medium"
                                    style={{
                                        backgroundColor: 'var(--color-background-muted)',
                                        color: 'var(--color-foreground-muted)',
                                        border: '1px solid var(--color-border)'
                                    }}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div 
                        className="p-5 rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-primary-muted)',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                            <h3 className="font-semibold">Predictive Drivers</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span style={{ color: 'var(--color-foreground-muted)' }}>Revenue Growth Rate</span>
                                    <span className="font-medium" style={{ color: 'var(--color-primary)' }}>Dominant</span>
                                </div>
                                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--color-background-muted)' }}>
                                    <div className="h-1.5 rounded-full" style={{ width: '85%', backgroundColor: 'var(--color-primary)' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span style={{ color: 'var(--color-foreground-muted)' }}>Tech Proficiency</span>
                                    <span className="font-medium" style={{ color: 'var(--color-primary)' }}>High</span>
                                </div>
                                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--color-background-muted)' }}>
                                    <div className="h-1.5 rounded-full" style={{ width: '65%', backgroundColor: 'rgba(59, 130, 246, 0.6)' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span style={{ color: 'var(--color-foreground-muted)' }}>Market Stability</span>
                                    <span className="font-medium" style={{ color: 'var(--color-foreground-subtle)' }}>Medium</span>
                                </div>
                                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--color-background-muted)' }}>
                                    <div className="h-1.5 rounded-full" style={{ width: '45%', backgroundColor: 'rgba(59, 130, 246, 0.4)' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terminal Panel */}
                <div className="lg:col-span-2">
                    <div 
                        className="rounded-xl overflow-hidden h-full flex flex-col"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <div 
                            className="px-4 py-3 flex items-center justify-between"
                            style={{
                                backgroundColor: 'var(--color-background-subtle)',
                                borderBottom: '1px solid var(--color-border)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                <span className="text-xs font-mono" style={{ color: 'var(--color-foreground-muted)' }}>evaluation_logs / growth_model.rf</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.5)' }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.5)' }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }} />
                            </div>
                        </div>
                        <div 
                            className="p-6 flex-grow overflow-auto max-h-[500px] font-mono"
                            style={{ backgroundColor: 'var(--color-background)' }}
                        >
                            <pre 
                                className="text-sm leading-relaxed whitespace-pre-wrap"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                {mockMetrics}
                            </pre>
                        </div>
                        <div 
                            className="px-4 py-2.5 flex justify-between items-center"
                            style={{
                                backgroundColor: 'var(--color-background-elevated)',
                                borderTop: '1px solid var(--color-border)'
                            }}
                        >
                            <span className="text-xs font-mono" style={{ color: 'var(--color-foreground-subtle)' }}>SESSION: RF-2026.4</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success)' }} />
                                <span className="text-xs font-mono" style={{ color: 'var(--color-foreground-subtle)' }}>CONNECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
