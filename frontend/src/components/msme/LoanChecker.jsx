import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2, IndianRupee, Percent, Clock, Building, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loadCSV } from '../../utils/csvParser';

const LOAN_PRODUCTS = [
    {
        id: 'mudra-shishu',
        name: 'MUDRA Shishu',
        type: 'Government',
        maxAmount: 50000,
        interestRate: 10,
        tenure: 60,
        requirements: { minGST: 0, maxDebtRatio: 0.8, minDocScore: 40, minRevenue: 0 },
        description: 'For micro enterprises just starting up. Minimal documentation required.'
    },
    {
        id: 'mudra-kishore',
        name: 'MUDRA Kishore',
        type: 'Government',
        maxAmount: 500000,
        interestRate: 12,
        tenure: 60,
        requirements: { minGST: 60, maxDebtRatio: 0.6, minDocScore: 55, minRevenue: 100000 },
        description: 'For growing micro/small enterprises with basic compliance.'
    },
    {
        id: 'mudra-tarun',
        name: 'MUDRA Tarun',
        type: 'Government',
        maxAmount: 1000000,
        interestRate: 13.5,
        tenure: 84,
        requirements: { minGST: 70, maxDebtRatio: 0.5, minDocScore: 65, minRevenue: 500000 },
        description: 'For established MSMEs with good compliance and revenue track record.'
    },
    {
        id: 'cgtmse',
        name: 'CGTMSE Collateral-Free Loan',
        type: 'Government',
        maxAmount: 20000000,
        interestRate: 11,
        tenure: 120,
        requirements: { minGST: 75, maxDebtRatio: 0.45, minDocScore: 70, minRevenue: 1000000 },
        description: 'Collateral-free credit for micro and small enterprises under CGTMSE guarantee.'
    },
    {
        id: 'bank-term',
        name: 'Bank Term Loan (MSME)',
        type: 'Commercial',
        maxAmount: 50000000,
        interestRate: 14,
        tenure: 120,
        requirements: { minGST: 80, maxDebtRatio: 0.4, minDocScore: 75, minRevenue: 2000000 },
        description: 'Standard commercial term loan for medium enterprises with strong financials.'
    },
    {
        id: 'sidbi',
        name: 'SIDBI Direct Credit',
        type: 'Government',
        maxAmount: 100000000,
        interestRate: 10.5,
        tenure: 180,
        requirements: { minGST: 85, maxDebtRatio: 0.35, minDocScore: 80, minRevenue: 5000000 },
        description: 'Direct lending by SIDBI for well-established MSMEs with excellent compliance.'
    }
];

export default function LoanChecker() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loanAmount, setLoanAmount] = useState('');
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const predictions = await loadCSV('/data/msme_predictions.csv');
            const mine = predictions.find(m => m.MSME_ID === user.msmeId);
            setProfile(mine);
            setLoading(false);
        }
        fetchData();
    }, [user.msmeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Checking your loan eligibility...</span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-12 text-center rounded-xl" style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}>
                <p style={{ color: 'var(--color-foreground-muted)' }}>No profile found for {user.msmeId}</p>
            </div>
        );
    }

    const gstScore = Number(profile.GST_Compliance_Score);
    const debtRatio = Number(profile.Loan_to_Revenue_Ratio);
    const docScore = Number(profile.Documentation_Readiness_Score);
    const revenue = Number(profile.Annual_Revenue);

    const checkEligibility = (product) => {
        const checks = [
            { label: 'GST Compliance', pass: gstScore >= product.requirements.minGST, yours: gstScore.toFixed(1), required: `>= ${product.requirements.minGST}` },
            { label: 'Debt Ratio', pass: debtRatio <= product.requirements.maxDebtRatio, yours: debtRatio.toFixed(2), required: `<= ${product.requirements.maxDebtRatio}` },
            { label: 'Documentation', pass: docScore >= product.requirements.minDocScore, yours: docScore.toFixed(1), required: `>= ${product.requirements.minDocScore}` },
            { label: 'Annual Revenue', pass: revenue >= product.requirements.minRevenue, yours: `₹${(revenue / 100000).toFixed(1)}L`, required: `>= ₹${(product.requirements.minRevenue / 100000).toFixed(0)}L` },
        ];
        const passed = checks.filter(c => c.pass).length;
        const eligible = passed === checks.length;
        return { checks, eligible, score: passed };
    };

    const eligibilityResults = LOAN_PRODUCTS.map(p => ({ ...p, ...checkEligibility(p) }));
    const eligibleCount = eligibilityResults.filter(r => r.eligible).length;

    const emiCalc = (amount, rate, months) => {
        const r = rate / 100 / 12;
        return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ backgroundColor: 'var(--color-warning-muted)', color: 'var(--color-warning)', border: '1px solid rgba(245,158,11,0.2)' }}
                >
                    Loan Eligibility
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">Loan Eligibility Checker</h1>
                <p style={{ color: 'var(--color-foreground-muted)' }}>
                    Based on your financial profile, check eligibility across government and commercial loan products
                </p>
            </div>

            {/* Profile Summary */}
            <div
                className="rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
                style={{ backgroundColor: 'var(--color-background-elevated)', border: '1px solid var(--color-border)' }}
            >
                {[
                    { label: 'GST Compliance', value: gstScore.toFixed(1), icon: CheckCircle, good: gstScore >= 70, color: gstScore >= 70 ? 'var(--color-success)' : 'var(--color-warning)' },
                    { label: 'Debt Ratio', value: debtRatio.toFixed(2), icon: CreditCard, good: debtRatio <= 0.5, color: debtRatio <= 0.5 ? 'var(--color-success)' : 'var(--color-warning)' },
                    { label: 'Doc Readiness', value: docScore.toFixed(1), icon: Building, good: docScore >= 65, color: docScore >= 65 ? 'var(--color-success)' : 'var(--color-warning)' },
                    { label: 'Annual Revenue', value: `₹${(revenue / 10000000).toFixed(2)} Cr`, icon: IndianRupee, good: true, color: 'var(--color-primary)' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: item.color + '22' }}>
                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>{item.label}</p>
                            <p className="font-semibold text-sm">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div
                className="p-5 rounded-xl"
                style={{
                    backgroundColor: eligibleCount > 0 ? 'var(--color-success-muted)' : 'var(--color-background-elevated)',
                    border: `1px solid ${eligibleCount > 0 ? 'var(--color-success)' : 'var(--color-border)'}`
                }}
            >
                <p className="font-semibold">
                    You are eligible for <span style={{ color: 'var(--color-success)' }}>{eligibleCount}</span> out of {LOAN_PRODUCTS.length} loan products
                </p>
                {eligibleCount === 0 && (
                    <p className="text-sm mt-1" style={{ color: 'var(--color-foreground-muted)' }}>
                        Improve your GST compliance, reduce debt, and improve documentation to unlock more loan options.
                    </p>
                )}
            </div>

            {/* Loan Products */}
            <div className="space-y-4">
                {eligibilityResults.map((product) => (
                    <div
                        key={product.id}
                        className="rounded-xl transition-all"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: product.eligible ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                            borderLeft: product.eligible ? '4px solid var(--color-success)' : '4px solid var(--color-border)'
                        }}
                    >
                        <div
                            className="p-5 cursor-pointer"
                            onClick={() => setSelectedLoan(selectedLoan === product.id ? null : product.id)}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="p-2.5 rounded-lg flex-shrink-0"
                                        style={{
                                            backgroundColor: product.eligible ? 'var(--color-success-muted)' : 'var(--color-background-subtle)',
                                        }}
                                    >
                                        {product.eligible
                                            ? <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                                            : <XCircle className="w-5 h-5" style={{ color: 'var(--color-foreground-subtle)' }} />
                                        }
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: product.type === 'Government' ? 'var(--color-primary-muted)' : 'var(--color-background-muted)',
                                                    color: product.type === 'Government' ? 'var(--color-primary)' : 'var(--color-foreground-muted)'
                                                }}
                                            >
                                                {product.type}
                                            </span>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                style={{
                                                    backgroundColor: product.eligible ? 'var(--color-success-muted)' : 'var(--color-background-muted)',
                                                    color: product.eligible ? 'var(--color-success)' : 'var(--color-foreground-muted)'
                                                }}
                                            >
                                                {product.eligible ? 'Eligible' : `${product.score}/4 criteria met`}
                                            </span>
                                        </div>
                                        <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>{product.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Max Loan</p>
                                        <p className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                            ₹{product.maxAmount >= 10000000 ? `${product.maxAmount / 10000000} Cr` : `${product.maxAmount / 100000}L`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Rate</p>
                                        <p className="font-semibold">{product.interestRate}% p.a.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Eligibility Checks */}
                        {selectedLoan === product.id && (
                            <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Eligibility checks */}
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3">Eligibility Criteria</h4>
                                        <div className="space-y-3">
                                            {product.checks.map((check) => (
                                                <div key={check.label} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {check.pass
                                                            ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                                                            : <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-destructive)' }} />
                                                        }
                                                        <span style={{ color: 'var(--color-foreground-muted)' }}>{check.label}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium" style={{ color: check.pass ? 'var(--color-success)' : 'var(--color-destructive)' }}>
                                                            {check.yours}
                                                        </span>
                                                        <span className="text-xs ml-1" style={{ color: 'var(--color-foreground-subtle)' }}>
                                                            (req: {check.required})
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* EMI Calculator */}
                                    {product.eligible && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">EMI Calculator</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs mb-1 block" style={{ color: 'var(--color-foreground-muted)' }}>Loan Amount (₹)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                                                        style={{
                                                            backgroundColor: 'var(--color-background-subtle)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-foreground)'
                                                        }}
                                                        placeholder={`Max: ₹${product.maxAmount.toLocaleString()}`}
                                                        value={loanAmount}
                                                        onChange={(e) => setLoanAmount(e.target.value)}
                                                        max={product.maxAmount}
                                                    />
                                                </div>
                                                {loanAmount && Number(loanAmount) > 0 && Number(loanAmount) <= product.maxAmount && (
                                                    <div
                                                        className="p-4 rounded-lg"
                                                        style={{ backgroundColor: 'var(--color-background-subtle)', border: '1px solid var(--color-border)' }}
                                                    >
                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Monthly EMI</p>
                                                                <p className="font-bold" style={{ color: 'var(--color-primary)' }}>
                                                                    ₹{emiCalc(Number(loanAmount), product.interestRate, product.tenure).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Tenure</p>
                                                                <p className="font-bold">{product.tenure / 12} years</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Total Interest</p>
                                                                <p className="font-bold" style={{ color: 'var(--color-warning)' }}>
                                                                    ₹{(emiCalc(Number(loanAmount), product.interestRate, product.tenure) * product.tenure - Number(loanAmount)).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>Total Payment</p>
                                                                <p className="font-bold">
                                                                    ₹{(emiCalc(Number(loanAmount), product.interestRate, product.tenure) * product.tenure).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {loanAmount && Number(loanAmount) > product.maxAmount && (
                                                    <p className="text-xs" style={{ color: 'var(--color-destructive)' }}>
                                                        Amount exceeds maximum loan limit of ₹{product.maxAmount.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
