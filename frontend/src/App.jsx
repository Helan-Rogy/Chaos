import React, { useState } from 'react';
import AdvisoryTab from './components/AdvisoryTab';
import PolicyTab from './components/PolicyTab';
import DataTab from './components/DataTab';
import ModelTab from './components/ModelTab';
import { Activity, LayoutDashboard, Settings, Database, Brain, Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('policy');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'data', name: 'Data Explorer', icon: Database },
    { id: 'model', name: 'AI Model Metrics', icon: Brain },
    { id: 'advisory', name: 'Advisory Interface', icon: LayoutDashboard },
    { id: 'policy', name: 'Policy Optimization', icon: Settings },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-artha-saffron/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-artha-gold/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto glass-card border-white/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="bg-artha-saffron p-2 rounded-xl shadow-glow-saffron group-hover:rotate-12 transition-transform duration-300">
              <Activity className="h-6 w-6 text-artha-navy" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              ARTHA<span className="text-artha-saffron">.</span>CORE
            </span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-white/10 text-artha-saffron shadow-inner'
                  : 'text-artha-slate hover:text-white hover:bg-white/5'
                  }`}
              >
                <tab.icon className={`h-4 w-4 mr-2 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-artha-slate hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-2 glass-card border-white/20 animate-fade-in">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${activeTab === tab.id
                  ? 'bg-artha-saffron text-artha-navy shadow-glow-saffron'
                  : 'text-artha-slate hover:text-white hover:bg-white/5'
                  }`}
              >
                <tab.icon className="h-4 w-4 mr-3" />
                {tab.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-8 animate-fade-in">
        <div className="min-h-[70vh]">
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'model' && <ModelTab />}
          {activeTab === 'advisory' && <AdvisoryTab />}
          {activeTab === 'policy' && <PolicyTab />}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 py-8 px-4 text-center">
        <p className="text-artha-slate text-xs opacity-50 font-medium tracking-widest uppercase">
          &copy; 2026 ARTHA MSME Engine &bull; Strategic Economic Intelligence
        </p>
      </footer>
    </div>
  );
}

export default App;
