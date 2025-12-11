import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { SearchResult } from '../types';
import { GrantCard } from './GrantCard';
import { DeadlineCalendar } from './DeadlineCalendar';

interface ResultsViewProps {
  result: SearchResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const handleGoogleSearch = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Calendar View */}
      {result.opportunities.length > 0 && (
        <DeadlineCalendar opportunities={result.opportunities} />
      )}

      {/* Structured Cards Section */}
      {result.opportunities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="text-blue-900" />
              Top Opportunities
            </h2>
            <span className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
              {result.opportunities.length} Found
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.opportunities.map((grant, index) => (
              <GrantCard 
                key={index} 
                grant={grant} 
                onSearchSource={handleGoogleSearch}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Markdown Report (Fallback or Additional Info) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <List className="text-slate-400" />
                <h3 className="text-lg font-bold text-slate-900 m-0">Detailed Analysis</h3>
             </div>
            <div className="prose prose-slate prose-headings:text-slate-900 prose-a:text-blue-900 max-w-none prose-sm">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold text-slate-800 mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-slate-800 mt-5 mb-3" {...props} />,
                  li: ({node, ...props}) => <li className="text-slate-600" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-900 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                }}
              >
                {result.rawMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar - Sources */}
        <div className="lg:col-span-1">
          <div className="bg-blue-950 rounded-xl border border-blue-900 p-6 sticky top-24 text-white">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-300">
              <AlertCircle size={16} />
              Official Sources
            </h3>
            
            {result.sources.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No direct web sources linked.</p>
            ) : (
              <div className="space-y-3">
                {result.sources.map((source, index) => (
                  <a 
                    key={index} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group bg-blue-900/50 hover:bg-blue-800 border border-blue-800 hover:border-slate-500 p-3 rounded-lg transition-all"
                  >
                    <p className="text-sm font-medium text-white group-hover:text-blue-100 line-clamp-2 leading-tight mb-1">
                      {source.title}
                    </p>
                    <div className="flex items-center text-xs text-slate-400 gap-1">
                       <span className="truncate max-w-[200px]">{new URL(source.uri).hostname}</span>
                       <ExternalLink size={10} />
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-blue-800/50">
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">Pro Tip:</span> High competition grants (Erasmus+) require 2-3 months of prep. Local municipal grants often have shorter windows (21 days).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};