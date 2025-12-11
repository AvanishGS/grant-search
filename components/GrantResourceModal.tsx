import React from 'react';
import { X, Lightbulb, FileCheck2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GrantResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'ADVICE' | 'TEMPLATE' | null;
  content: string;
  isLoading: boolean;
}

export const GrantResourceModal: React.FC<GrantResourceModalProps> = ({ 
  isOpen, onClose, title, type, content, isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${type === 'ADVICE' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {type === 'ADVICE' ? <Lightbulb size={24} /> : <FileCheck2 size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {type === 'ADVICE' ? 'Expert Consultant Advice' : 'Success Template Example'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={40} className="text-blue-900 animate-spin" />
              <p className="text-slate-500 font-medium">Consulting our AI experts...</p>
            </div>
          ) : (
            <div className="prose prose-slate prose-headings:text-blue-900 prose-strong:text-slate-800 prose-li:marker:text-blue-900">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};