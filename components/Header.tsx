import React from 'react';
import { Flag } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> 
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                EdukWings <span className="text-blue-900">GrantFinder</span>
                <Flag size={14} className="text-slate-400 fill-current" />
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Empowering Education & Civil Society</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <a href="#" className="text-slate-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About Foundation
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Support
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};