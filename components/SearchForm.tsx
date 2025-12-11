import React, { useState } from 'react';
import { Search, Sparkles, Target, Briefcase, Tag, Globe2, MapPin } from 'lucide-react';
import { SECTORS, PROJECT_TYPES, GrantSearchRequest } from '../types';

interface SearchFormProps {
  onSearch: (request: GrantSearchRequest) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [sector, setSector] = useState(SECTORS[0]);
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [keywords, setKeywords] = useState('');
  const [regionScope, setRegionScope] = useState<'POLISH' | 'EUROPEAN'>('EUROPEAN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ sector, projectType, keywords, regionScope });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 transform transition-all hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 p-2 rounded-lg">
          <Search className="text-blue-900" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Find Funding</h2>
          <p className="text-sm text-slate-500">Configure your search parameters</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Region Scope Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRegionScope('POLISH')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              regionScope === 'POLISH' 
                ? 'bg-blue-50 border-blue-900 text-blue-900 ring-1 ring-blue-900' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
               <MapPin size={18} />
               <span className="font-bold text-sm">Polish Grants</span>
            </div>
            <span className="text-[10px] opacity-75">National & Local Only</span>
          </button>
          
          <button
             type="button"
             onClick={() => setRegionScope('EUROPEAN')}
             className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              regionScope === 'EUROPEAN' 
                ? 'bg-blue-50 border-blue-900 text-blue-900 ring-1 ring-blue-900' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
             <div className="flex items-center gap-2 mb-1">
               <Globe2 size={18} />
               <span className="font-bold text-sm">All European</span>
            </div>
            <span className="text-[10px] opacity-75">EU Funds + Polish</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700 gap-2">
              <Target size={16} /> Sector
            </label>
            <div className="relative">
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full appearance-none rounded-xl border-slate-200 border bg-slate-50 p-3.5 text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all cursor-pointer hover:border-blue-300"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700 gap-2">
              <Briefcase size={16} /> Project Type
            </label>
            <div className="relative">
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full appearance-none rounded-xl border-slate-200 border bg-slate-50 p-3.5 text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all cursor-pointer hover:border-blue-300"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700 gap-2 mb-1">
            <Tag size={16} /> Keywords <span className="text-slate-400 font-normal ml-auto text-xs">Optional</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. mental health, digitization, rural areas..."
            className="w-full rounded-xl border-slate-200 border bg-slate-50 p-3.5 text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold tracking-wide transition-all transform active:scale-95 ${
            isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 shadow-lg hover:shadow-slate-500/30'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning Databases...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Search Opportunities
            </>
          )}
        </button>
      </form>
    </div>
  );
};