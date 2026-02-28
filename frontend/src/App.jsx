import React, { useState } from 'react';
import AdvisoryTab from './components/AdvisoryTab';
import PolicyTab from './components/PolicyTab';
import DataTab from './components/DataTab';
import ModelTab from './components/ModelTab';
import { TrendingUp, LayoutDashboard, Settings, Database, Brain, Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('policy');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'data', name: 'Data Explorer', icon: Database },
    { id: 'model', name: 'AI Model', icon: Brain },
    { id: 'advisory', name: 'Advisory', icon: LayoutDashboard },
    { id: 'policy', name: 'Optimization', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary-900">
      <nav className="sticky top-0 z-50 bg-secondary-800/95 backdrop-blur-sm border-b border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-white">MSME Optimization</h1>
                <p className="text-xs text-secondary-400">Policy Intelligence Platform</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-300 hover:text-white hover:bg-secondary-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>

            <button
              className="md:hidden p-2 text-secondary-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-300 hover:text-white hover:bg-secondary-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'model' && <ModelTab />}
          {activeTab === 'advisory' && <AdvisoryTab />}
          {activeTab === 'policy' && <PolicyTab />}
        </div>
      </main>

      <footer className="mt-16 py-6 border-t border-secondary-800">
        <p className="text-center text-secondary-500 text-sm">
          MSME Growth Advisory & Subsidy Optimization Platform
        </p>
      </footer>
    </div>
  );
}

export default App;
