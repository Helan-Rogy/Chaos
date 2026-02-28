import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import PolicyTab from './components/PolicyTab';
import DataTab from './components/DataTab';
import ModelTab from './components/ModelTab';
import SchemeBrowser from './components/msme/SchemeBrowser';
import ApplicationTracker from './components/msme/ApplicationTracker';
import MyAdvisor from './components/msme/MyAdvisor';
import BusinessHealth from './components/msme/BusinessHealth';
import LoanChecker from './components/msme/LoanChecker';
import { Settings, Database, Brain, Menu, X, Sparkles, LogOut, User, FileSearch, ClipboardList, Lightbulb, Activity, CreditCard } from 'lucide-react';

function Dashboard() {
  const { user, logout, isPolicyMaker, isMSME } = useAuth();
  const defaultTab = user?.role === 'policymaker' ? 'data' : 'schemes';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Policy Maker tabs
  const policyMakerTabs = [
    { id: 'data', name: 'Data Explorer', icon: Database },
    { id: 'model', name: 'AI Model', icon: Brain },
    { id: 'policy', name: 'Policy Engine', icon: Settings },
  ];

  // MSME tabs
  const msmeTabs = [
    { id: 'schemes', name: 'Browse Schemes', icon: FileSearch },
    { id: 'applications', name: 'My Applications', icon: ClipboardList },
    { id: 'advisor', name: 'My Advisor', icon: Lightbulb },
    { id: 'health', name: 'Business Health', icon: Activity },
    { id: 'loans', name: 'Loan Eligibility', icon: CreditCard },
  ];

  const tabs = isPolicyMaker ? policyMakerTabs : msmeTabs;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      {/* Navbar */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ 
          backgroundColor: 'rgba(10, 10, 10, 0.8)', 
          borderBottom: '1px solid var(--color-border)' 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg">
                Pragati
              </span>
              <span 
                className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: isPolicyMaker ? 'var(--color-primary-muted)' : 'var(--color-success-muted)',
                  color: isPolicyMaker ? 'var(--color-primary)' : 'var(--color-success)'
                }}
              >
                {isPolicyMaker ? 'Policy Maker' : 'MSME'}
              </span>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'var(--color-background-subtle)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--color-foreground)' : 'var(--color-foreground-muted)'
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: 'var(--color-foreground-muted)' }}>
                <User className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ 
                  backgroundColor: 'var(--color-background-subtle)',
                  color: 'var(--color-foreground-muted)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 transition-colors rounded-lg"
                style={{ color: 'var(--color-foreground-muted)' }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden"
            style={{ 
              backgroundColor: 'var(--color-background-elevated)',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--color-foreground-muted)'
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Policy Maker Views */}
          {user?.role === 'policymaker' && activeTab === 'data' && <DataTab />}
          {user?.role === 'policymaker' && activeTab === 'model' && <ModelTab />}
          {user?.role === 'policymaker' && activeTab === 'policy' && <PolicyTab />}
          
          {/* MSME Views */}
          {user?.role === 'msme' && activeTab === 'schemes' && <SchemeBrowser />}
          {user?.role === 'msme' && activeTab === 'applications' && <ApplicationTracker />}
          {user?.role === 'msme' && activeTab === 'advisor' && <MyAdvisor />}
          {user?.role === 'msme' && activeTab === 'health' && <BusinessHealth />}
          {user?.role === 'msme' && activeTab === 'loans' && <LoanChecker />}
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="py-6 mt-12"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p 
            className="text-center text-xs"
            style={{ color: 'var(--color-foreground-subtle)' }}
          >
            Pragati MSME Optimization Engine • Logged in as {user?.email}
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <p style={{ color: 'var(--color-foreground-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
