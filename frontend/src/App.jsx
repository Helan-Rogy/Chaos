import React, { useState } from 'react';
import AdvisoryTab from './components/AdvisoryTab';
import PolicyTab from './components/PolicyTab';
import DataTab from './components/DataTab';
import ModelTab from './components/ModelTab';
import { LayoutDashboard, Settings, Database, Brain, Menu, X, Sparkles } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('policy');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'data', name: 'Data Explorer', icon: Database },
    { id: 'model', name: 'AI Model', icon: Brain },
    { id: 'advisory', name: 'Advisory', icon: LayoutDashboard },
    { id: 'policy', name: 'Policy Engine', icon: Settings },
  ];

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
                ChaosZen
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
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'model' && <ModelTab />}
          {activeTab === 'advisory' && <AdvisoryTab />}
          {activeTab === 'policy' && <PolicyTab />}
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
            ChaosZen MSME Optimization Engine
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
