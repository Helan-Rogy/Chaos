import React, { useState, useEffect } from 'react';
import { Building2, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loadCSV } from '../utils/csvParser';

export default function LoginPage() {
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1 = role selection, 2 = details
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');
    const [selectedMsme, setSelectedMsme] = useState('');
    const [msmeList, setMsmeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchMsmeList() {
            const data = await loadCSV('/data/msme_data.csv');
            setMsmeList(data.slice(0, 100)); // Limit for dropdown
        }
        fetchMsmeList();
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        if (role === 'msme' && !selectedMsme) {
            setError('Please select your MSME profile');
            return;
        }

        setLoading(true);
        // Simulate brief loading
        setTimeout(() => {
            login(email, role, role === 'msme' ? selectedMsme : null);
            setLoading(false);
        }, 500);
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: 'var(--color-background)' }}
        >
            <div 
                className="w-full max-w-lg p-8 rounded-2xl"
                style={{ 
                    backgroundColor: 'var(--color-background-elevated)',
                    border: '1px solid var(--color-border)'
                }}
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div 
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ 
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)'
                        }}
                    >
                        <span className="text-2xl font-bold text-white">PR</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to Pragati</h1>
                    <p style={{ color: 'var(--color-foreground-muted)' }}>
                        MSME Scheme Impact & Optimization Engine
                    </p>
                </div>

                {step === 1 ? (
                    /* Step 1: Role Selection */
                    <div className="space-y-4">
                        <p className="text-center text-sm mb-6" style={{ color: 'var(--color-foreground-muted)' }}>
                            Select your role to continue
                        </p>
                        
                        <button
                            onClick={() => handleRoleSelect('policymaker')}
                            className="w-full p-6 rounded-xl text-left transition-all hover:scale-[1.02]"
                            style={{ 
                                backgroundColor: 'var(--color-background-subtle)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div 
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: 'var(--color-primary-muted)' }}
                                >
                                    <Users className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">Policy Maker</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                                        Access data analytics, model metrics, advisory tools, and budget optimization
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 mt-1" style={{ color: 'var(--color-foreground-subtle)' }} />
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('msme')}
                            className="w-full p-6 rounded-xl text-left transition-all hover:scale-[1.02]"
                            style={{ 
                                backgroundColor: 'var(--color-background-subtle)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div 
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: 'var(--color-success-muted)' }}
                                >
                                    <Building2 className="w-6 h-6" style={{ color: 'var(--color-success)' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">MSME Owner</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                                        Browse eligible schemes, track applications, and view projected benefits
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 mt-1" style={{ color: 'var(--color-foreground-subtle)' }} />
                            </div>
                        </button>
                    </div>
                ) : (
                    /* Step 2: Login Details */
                    <form onSubmit={handleLogin} className="space-y-5">
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); }}
                            className="text-sm flex items-center gap-1 mb-4 transition-colors"
                            style={{ color: 'var(--color-foreground-muted)' }}
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to role selection
                        </button>

                        <div 
                            className="p-4 rounded-lg flex items-center gap-3"
                            style={{ 
                                backgroundColor: role === 'policymaker' ? 'var(--color-primary-muted)' : 'var(--color-success-muted)',
                                border: `1px solid ${role === 'policymaker' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(20, 184, 166, 0.3)'}`
                            }}
                        >
                            {role === 'policymaker' ? (
                                <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                            ) : (
                                <Building2 className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                            )}
                            <span className="font-medium">
                                {role === 'policymaker' ? 'Policy Maker Login' : 'MSME Owner Login'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: 'var(--color-background-subtle)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-foreground)'
                                }}
                            />
                        </div>

                        {role === 'msme' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Your MSME Profile</label>
                                <select
                                    value={selectedMsme}
                                    onChange={(e) => setSelectedMsme(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        backgroundColor: 'var(--color-background-subtle)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-foreground)'
                                    }}
                                >
                                    <option value="">Select MSME...</option>
                                    {msmeList.map((msme) => (
                                        <option key={msme.MSME_ID} value={msme.MSME_ID}>
                                            {msme.MSME_ID} - {msme.Sector} ({msme.Category})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {error && (
                            <p className="text-sm px-3 py-2 rounded-lg" style={{ 
                                backgroundColor: 'var(--color-error-muted)',
                                color: 'var(--color-error)'
                            }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center" style={{ color: 'var(--color-foreground-subtle)' }}>
                            Demo mode - No password required
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
