import React from 'react';
import { Calendar, Building, Wallet, Clock, FileText, PieChart, Users, Zap, ExternalLink, Lightbulb, FileCheck2 } from 'lucide-react';
import { GrantOpportunity } from '../types';

interface GrantCardProps {
  grant: GrantOpportunity;
  onSearchSource: (query: string) => void;
}

export const GrantCard: React.FC<GrantCardProps> = ({ grant, onSearchSource }) => {
  const getDaysLeft = (dateStr: string) => {
    if (dateStr.toLowerCase().includes('ongoing')) return '∞';
    const deadline = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(deadline.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? '?' : diffDays;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border border-yellow-100';
      case 'high': return 'text-orange-700 bg-orange-50 border border-orange-100';
      case 'very high': return 'text-red-700 bg-red-50 border border-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-900 border-blue-900';
    if (score >= 50) return 'text-blue-700 border-blue-700';
    return 'text-slate-500 border-slate-400';
  };

  const daysLeft = getDaysLeft(grant.deadline);
  const isUrgent = typeof daysLeft === 'number' && daysLeft < 14;

  // Helper for admin burden meter
  const AdminBurdenMeter = ({ level }: { level: string }) => {
    const bars = level.toLowerCase() === 'low' ? 1 : level.toLowerCase() === 'medium' ? 2 : 3;
    return (
      <div className="flex gap-1" title={`Administrative Burden: ${level}`}>
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`h-2 w-3 rounded-full ${i <= bars ? (bars === 1 ? 'bg-emerald-500' : bars === 2 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-slate-200'}`} 
          />
        ))}
      </div>
    );
  };

  const handleActionClick = () => {
    if (grant.url && (grant.url.startsWith('http') || grant.url.startsWith('www'))) {
      const targetUrl = grant.url.startsWith('www') ? `https://${grant.url}` : grant.url;
      window.open(targetUrl, '_blank');
    } else {
      onSearchSource(`${grant.title} ${grant.organization} official application`);
    }
  };

  const encodedTitle = encodeURIComponent(grant.title);
  const encodedOrg = encodeURIComponent(grant.organization);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group relative">
      
      {/* Top Section: Header & Match Score */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                  <Building size={12} /> {grant.organization}
                </span>
                {isUrgent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 animate-pulse">
                    <Clock size={12} /> Closing Soon
                    </span>
                )}
             </div>
             <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-900 transition-colors mb-2">
                {grant.title}
             </h3>
          </div>
          
          {/* Match Score Ring */}
          <div className="relative flex-shrink-0 flex flex-col items-center">
             <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm ${getScoreColor(grant.matchScore)}`}>
                {grant.matchScore}%
             </div>
             <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">Match</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {grant.description}
        </p>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                 <Wallet size={12} /> Grant Amount
              </div>
              <div className="font-bold text-slate-800 text-sm">{grant.amount}</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                 <Calendar size={12} /> Deadline
              </div>
              <div className={`font-bold text-sm ${isUrgent ? 'text-red-600' : 'text-slate-800'}`}>
                 {grant.deadline}
              </div>
           </div>
        </div>
      </div>

      {/* Advanced Analysis Dashboard */}
      <div className="bg-slate-50/80 border-t border-slate-100 p-5 flex-grow flex flex-col gap-4">
         
         {/* Financial Indicators */}
         <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
               <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <PieChart size={12} /> Co-financing
               </span>
               <div className={`text-xs font-semibold px-2 py-1 rounded border inline-block ${
                   grant.coFinancing.toLowerCase().includes('0%') || grant.coFinancing.toLowerCase().includes('none') 
                   ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                   : 'bg-white text-slate-700 border-slate-200'
               }`}>
                  {grant.coFinancing}
               </div>
            </div>
            <div>
               <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <Users size={12} /> Consortium
               </span>
               <div className="text-xs font-medium text-slate-700 truncate" title={grant.consortiumReq}>
                  {grant.consortiumReq}
               </div>
            </div>
            
            <div>
               <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <Zap size={12} /> Funding Type
               </span>
               <div className="text-xs font-medium text-slate-700 truncate" title={grant.fundingType}>
                  {grant.fundingType}
               </div>
            </div>

            <div>
               <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <Clock size={12} /> Duration
               </span>
               <div className="text-xs font-medium text-slate-700">
                  {grant.projectDuration}
               </div>
            </div>
         </div>

         <div className="h-px bg-slate-200/60 my-1"></div>

         {/* Complexity & Competition Row */}
         <div className="flex items-center justify-between">
            <div>
               <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Competition</span>
               <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(grant.competitionLevel)}`}>
                  {grant.competitionLevel} ({grant.successRateEstimate})
               </span>
            </div>
            
            <div className="text-right">
               <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1 flex justify-end items-center gap-1">
                  <FileText size={10} /> Admin Burden
               </span>
               <AdminBurdenMeter level={grant.adminBurden} />
            </div>
         </div>
      </div>

      {/* Advanced Tools Footer */}
      <div className="px-4 py-3 bg-slate-100/50 border-t border-slate-100 flex gap-2">
         <a 
           href={`https://www.google.com/search?q=guide+how+to+win+${encodedTitle}+${encodedOrg}+grant+tips`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-blue-900 hover:border-blue-200 hover:bg-blue-50 transition-colors no-underline"
           title="Search for Expert Advice on Google"
         >
           <Lightbulb size={14} className="text-yellow-500" /> Expert Advice
         </a>
         <a 
           href={`https://www.google.com/search?q=${encodedTitle}+${encodedOrg}+successful+project+application+example+filetype:pdf`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-emerald-900 hover:border-emerald-200 hover:bg-emerald-50 transition-colors no-underline"
           title="Search for Successful Template PDFs on Google"
         >
           <FileCheck2 size={14} className="text-emerald-500" /> Success Template
         </a>
      </div>

      {/* Main Action Footer */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleActionClick}
          className="w-full bg-blue-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {grant.url ? (
            <>
              Go to Application Website <ExternalLink size={16} />
            </>
          ) : (
            <>
              Find Application Guide <span className="text-lg leading-none">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};