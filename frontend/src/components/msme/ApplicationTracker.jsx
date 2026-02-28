import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp, IndianRupee, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loadCSV } from '../../utils/csvParser';

export default function ApplicationTracker() {
    const { user } = useAuth();
    const [eligibility, setEligibility] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [eligibilityData, schemesData] = await Promise.all([
                loadCSV('/data/scheme_eligibility_results.csv'),
                loadCSV('/data/schemes_data.csv')
            ]);
            setEligibility(eligibilityData);
            setSchemes(schemesData);
            setLoading(false);
        }
        fetchData();
    }, []);

    // Get scheme details by ID
    const getScheme = (schemeId) => schemes.find(s => s.Scheme_ID === schemeId);

    // Get user's eligible schemes as "applications"
    const userApplications = eligibility
        .filter(e => e.MSME_ID === user.msmeId)
        .map((e, index) => {
            const scheme = getScheme(e.Scheme_ID);
            // Simulate different statuses based on index
            const statuses = ['approved', 'pending', 'under-review', 'approved', 'pending'];
            const status = statuses[index % statuses.length];
            const appliedDate = new Date();
            appliedDate.setDate(appliedDate.getDate() - (index * 7 + 5));
            
            return {
                ...e,
                scheme,
                status,
                appliedDate: appliedDate.toISOString().split('T')[0],
                applicationId: `APP-${user.msmeId}-${e.Scheme_ID}`.replace('MSME_', '')
            };
        });

    const statusConfig = {
        'approved': { 
            label: 'Approved', 
            icon: CheckCircle2, 
            color: 'var(--color-success)',
            bg: 'var(--color-success-muted)'
        },
        'pending': { 
            label: 'Pending Review', 
            icon: Clock, 
            color: 'var(--color-warning)',
            bg: 'var(--color-warning-muted)'
        },
        'under-review': { 
            label: 'Under Review', 
            icon: AlertCircle, 
            color: 'var(--color-primary)',
            bg: 'var(--color-primary-muted)'
        },
        'rejected': { 
            label: 'Rejected', 
            icon: XCircle, 
            color: 'var(--color-error)',
            bg: 'var(--color-error-muted)'
        }
    };

    // Summary stats
    const stats = {
        total: userApplications.length,
        approved: userApplications.filter(a => a.status === 'approved').length,
        pending: userApplications.filter(a => a.status === 'pending' || a.status === 'under-review').length,
        totalSubsidy: userApplications
            .filter(a => a.status === 'approved')
            .reduce((sum, a) => sum + Number(a.Subsidy_Applied || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span className="ml-3">Loading applications...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ 
                        backgroundColor: 'var(--color-primary-muted)', 
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}
                >
                    Application Tracker
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Your Scheme Applications
                </h1>
                <p style={{ color: 'var(--color-foreground-muted)' }}>
                    Track the status of your scheme applications and approved benefits
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    className="p-5 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-primary-muted)' }}
                        >
                            <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>Total Applications</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>

                <div 
                    className="p-5 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-success-muted)' }}
                        >
                            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>Approved</span>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>{stats.approved}</p>
                </div>

                <div 
                    className="p-5 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-warning-muted)' }}
                        >
                            <Clock className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>In Progress</span>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: 'var(--color-warning)' }}>{stats.pending}</p>
                </div>

                <div 
                    className="p-5 rounded-xl"
                    style={{
                        backgroundColor: 'var(--color-background-elevated)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-warning-muted)' }}
                        >
                            <IndianRupee className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-foreground-muted)' }}>Approved Subsidies</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
                        ₹{(stats.totalSubsidy / 100000).toFixed(1)}L
                    </p>
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Application History</h2>
                
                {userApplications.length === 0 ? (
                    <div 
                        className="p-12 text-center rounded-xl"
                        style={{
                            backgroundColor: 'var(--color-background-elevated)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-foreground-subtle)' }} />
                        <p style={{ color: 'var(--color-foreground-muted)' }}>No applications yet</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-foreground-subtle)' }}>
                            Browse eligible schemes and submit your first application
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {userApplications.map((app) => {
                            const StatusIcon = statusConfig[app.status].icon;
                            return (
                                <div 
                                    key={app.applicationId}
                                    className="p-5 rounded-xl"
                                    style={{
                                        backgroundColor: 'var(--color-background-elevated)',
                                        border: '1px solid var(--color-border)',
                                        borderLeft: `4px solid ${statusConfig[app.status].color}`
                                    }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span 
                                                    className="text-xs font-mono px-2 py-0.5 rounded"
                                                    style={{ 
                                                        backgroundColor: 'var(--color-background-muted)',
                                                        color: 'var(--color-foreground-muted)'
                                                    }}
                                                >
                                                    {app.applicationId}
                                                </span>
                                                <span 
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                                                    style={{ 
                                                        backgroundColor: statusConfig[app.status].bg,
                                                        color: statusConfig[app.status].color
                                                    }}
                                                >
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {statusConfig[app.status].label}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-lg mb-1">
                                                {app.scheme?.Scheme_Name || app.Scheme_ID}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Applied: {app.appliedDate}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Subsidy</p>
                                                <p className="font-semibold" style={{ color: 'var(--color-warning)' }}>
                                                    ₹{(Number(app.Subsidy_Applied) / 100000).toFixed(1)}L
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Revenue Boost</p>
                                                <p className="font-semibold" style={{ color: 'var(--color-success)' }}>
                                                    +{Number(app.Revenue_Increase_Pct).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs mb-1" style={{ color: 'var(--color-foreground-subtle)' }}>Jobs</p>
                                                <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                                                    +{app.New_Jobs_Added}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
