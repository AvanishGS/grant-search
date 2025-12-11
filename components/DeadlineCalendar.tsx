import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { GrantOpportunity } from '../types';

interface DeadlineCalendarProps {
  opportunities: GrantOpportunity[];
}

export const DeadlineCalendar: React.FC<DeadlineCalendarProps> = ({ opportunities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Optimize: Index grants by date string (YYYY-MM-DD) once, instead of filtering on every render/day loop
  const grantsByDate = useMemo(() => {
    const map: Record<string, GrantOpportunity[]> = {};
    
    opportunities.forEach(o => {
      // Handle "Ongoing" or invalid dates gracefully
      if (!o.deadline || o.deadline.toLowerCase().includes('ongoing')) return;
      
      const date = new Date(o.deadline);
      if (isNaN(date.getTime())) return;
      
      // Format as YYYY-MM-DD for key
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(o);
    });
    
    return map;
  }, [opportunities]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // 0 = Sunday, 1 = Monday. Adjust so Monday is first.
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8 animate-fade-in-up">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <CalendarIcon className="text-blue-900" size={20} />
           <h3 className="font-bold text-slate-900">Application Deadlines</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-700 w-32 text-center">
            {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </span>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 lg:gap-2">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="h-24 bg-slate-50/50 rounded-lg" />
          ))}
          {days.map(day => {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
            const grants = grantsByDate[dateKey] || [];
            const hasGrants = grants.length > 0;
            const isTodayDate = isToday(day);
            
            return (
              <div 
                key={day} 
                className={`h-24 border rounded-lg p-1.5 flex flex-col relative transition-all duration-200 ${
                  isTodayDate 
                    ? 'bg-blue-50 border-blue-200 shadow-inner' 
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <span className={`text-xs font-medium mb-1 ${isTodayDate ? 'text-blue-900' : 'text-slate-500'}`}>
                  {day}
                </span>
                
                <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                  {grants.map((g, idx) => (
                     <div 
                       key={idx} 
                       className="text-[9px] leading-tight bg-blue-100 text-blue-800 p-1 rounded font-medium truncate cursor-help hover:bg-blue-200 transition-colors"
                       title={`${g.title} (${g.deadline})`}
                     >
                       {g.title}
                     </div>
                  ))}
                </div>
                
                {hasGrants && (
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};