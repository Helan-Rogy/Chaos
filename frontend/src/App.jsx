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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-foreground">
                ChaosZen
              </span>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-background-subtle text-foreground'
                      : 'text-foreground-muted hover:text-foreground hover:bg-background-subtle/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground-muted hover:text-foreground transition-colors rounded-lg hover:bg-background-subtle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background-elevated animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-foreground-muted hover:text-foreground hover:bg-background-subtle'
                  }`}
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
        <div className="animate-fade-in">
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'model' && <ModelTab />}
          {activeTab === 'advisory' && <AdvisoryTab />}
          {activeTab === 'policy' && <PolicyTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-foreground-subtle text-xs">
            ChaosZen MSME Optimization Engine
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
