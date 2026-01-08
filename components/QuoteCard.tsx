
import React from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  onRefresh: () => void;
  onVisualize: () => void;
  isGeneratingImage: boolean;
  isLoading: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onRefresh, 
  onVisualize, 
  isGeneratingImage,
  isLoading 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    alert("Quote copied to clipboard!");
  };

  return (
    <div className="max-w-4xl w-full p-8 md:p-12 glass rounded-3xl transition-all duration-700 hover:shadow-2xl hover:shadow-white/5 group">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="text-zinc-500 uppercase tracking-[0.3em] text-xs font-medium">
          {quote.category}
        </div>
        
        <div className="relative">
          <span className="absolute -top-8 -left-8 text-8xl text-white/10 font-serif leading-none select-none">“</span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white leading-tight transition-all duration-500">
            {quote.text}
          </h1>
          <span className="absolute -bottom-12 -right-8 text-8xl text-white/10 font-serif leading-none select-none">”</span>
        </div>

        <div className="pt-4">
          <p className="text-xl md:text-2xl font-light text-zinc-300 tracking-wide">— {quote.author}</p>
          {quote.context && (
            <p className="mt-4 text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed italic">
              {quote.context}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t border-white/10 w-full max-w-md">
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="px-8 py-3 bg-white text-black rounded-full font-medium transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Thinking..." : "Next Wisdom"}
          </button>
          
          <button 
            onClick={onVisualize}
            disabled={isGeneratingImage || isLoading}
            className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-full font-medium transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isGeneratingImage ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Painting...
              </>
            ) : "Visualize"}
          </button>

          <button 
            onClick={copyToClipboard}
            className="p-3 bg-white/5 border border-white/20 text-white rounded-full hover:bg-white/10 transition-all active:scale-95"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
