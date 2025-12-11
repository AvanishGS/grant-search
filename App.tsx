import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsView } from './components/ResultsView';
import { searchGrants } from './services/gemini';
import { GrantSearchRequest, SearchResult, AppStatus } from './types';
import { ArrowRight, CheckCircle2, Users, Coins, AlertCircle } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const handleSearch = async (request: GrantSearchRequest) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    
    const scopeLabel = request.regionScope === 'POLISH' ? '🇵🇱 Polish Grants' : '🇪🇺 All European Grants';
    setLastQuery(`${scopeLabel} • ${request.sector}`);
    
    try {
      const data = await searchGrants(request);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      <Header />

      <main className="flex-grow w-full">
        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200 pb-12 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {status === AppStatus.IDLE && (
                        <div className="text-center mb-10 animate-fade-in-up">
                            <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wide mb-4 border border-slate-200">
                                EDUKWINGS INTELLIGENCE • POWERED BY GEMINI
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                                Securing Funds for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-slate-700">Educational Impact</span>
                            </h2>
                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Advanced grant analysis for Polish NGOs. Identify opportunities, estimate competition, and streamline your application strategy.
                            </p>
                            
                            <div className="flex justify-center gap-8 text-sm font-medium text-slate-500 mb-8">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-blue-900" />
                                    <span>Verified Sources</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-slate-600" />
                                    <span>Competition Analysis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Coins size={18} className="text-slate-600" />
                                    <span>Budget Insights</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <SearchForm onSearch={handleSearch} isLoading={status === AppStatus.LOADING} />
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Status Messages */}
            {status === AppStatus.ERROR && (
                <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center flex items-center justify-center gap-2">
                    <AlertCircle size={20} />
                    <span>Connection interrupted. Please try again.</span>
                </div>
            )}

            {/* Results Section */}
            {status === AppStatus.SUCCESS && result && (
                <div className="animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
                        <div>
                           <h3 className="text-2xl font-bold text-slate-900">Grant Intelligence Report</h3>
                           <p className="text-slate-500 mt-1">Found opportunities for <span className="font-semibold text-slate-900">{lastQuery}</span></p>
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="text-sm font-medium text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
                        >
                            Start New Search <ArrowRight size={16} />
                        </button>
                    </div>
                    <ResultsView result={result} />
                </div>
            )}

            {/* Educational Content (Only visible on Idle) */}
            {status === AppStatus.IDLE && (
                <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="p-4">
                        <h4 className="font-bold text-slate-900 mb-2">1. Smart Matching</h4>
                        <p className="text-sm text-slate-600">We filter thousands of calls to match your NGO's specific sector and activity.</p>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-slate-900 mb-2">2. Local & Global</h4>
                        <p className="text-sm text-slate-600">From Horizon Europe to your local City Hall (Urząd Miasta) grants.</p>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-slate-900 mb-2">3. Strategic Insight</h4>
                        <p className="text-sm text-slate-600">Know your chances before you apply with our competition level estimates.</p>
                    </div>
                </div>
            )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} EdukWings Foundation. <span className="hidden md:inline">|</span> All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-blue-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;