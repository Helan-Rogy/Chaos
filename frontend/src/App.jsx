import React, { useState } from 'react';
import AdvisoryTab from './components/AdvisoryTab';
import PolicyTab from './components/PolicyTab';
import { Activity, LayoutDashboard, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('policy'); // Default to Policy Optimization

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="font-bold text-xl tracking-tight text-slate-800">
                  ChaosZen MSME Engine
                </span>
              </div>
              <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('advisory')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'advisory'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Advisory Interface
                </button>
                <button
                  onClick={() => setActiveTab('policy')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'policy'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Policy Optimization Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'advisory' ? <AdvisoryTab /> : <PolicyTab />}
      </main>
    </div>
  );
}

export default App;
