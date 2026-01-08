
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, AppState } from './types';
import { fetchRandomQuote, generateVisualPrompt, generateQuoteImage } from './services/geminiService';
import { QuoteCard } from './components/QuoteCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    quote: null,
    isLoading: true,
    error: null,
    backgroundImage: null,
    isGeneratingImage: false,
  });

  const loadNewQuote = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const quote = await fetchRandomQuote();
      setState(prev => ({ ...prev, quote, isLoading: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "The wisdom is momentarily clouded. Please try again." 
      }));
    }
  }, []);

  const handleVisualize = async () => {
    if (!state.quote) return;
    
    setState(prev => ({ ...prev, isGeneratingImage: true }));
    try {
      const prompt = await generateVisualPrompt(state.quote);
      const imageUrl = await generateQuoteImage(prompt);
      setState(prev => ({ ...prev, backgroundImage: imageUrl, isGeneratingImage: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, isGeneratingImage: false }));
      alert("The canvas remains empty. Image generation failed.");
    }
  };

  useEffect(() => {
    loadNewQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-zinc-950">
      {/* Background Image Layer */}
      {state.backgroundImage && (
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out opacity-40 scale-110 blur-sm"
          style={{ 
            backgroundImage: `url(${state.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Ambient Animated Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-rose-500/10 rounded-full blur-[120px] float" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 w-full flex flex-col items-center">
        {state.isLoading && !state.quote ? (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-zinc-500 tracking-widest uppercase text-xs">Summoning Wisdom</p>
          </div>
        ) : state.error ? (
          <div className="text-center space-y-6 glass p-8 rounded-2xl">
            <p className="text-xl font-light text-zinc-400">{state.error}</p>
            <button 
              onClick={loadNewQuote}
              className="px-8 py-3 bg-white text-black rounded-full font-medium"
            >
              Retry
            </button>
          </div>
        ) : state.quote && (
          <QuoteCard 
            quote={state.quote} 
            onRefresh={loadNewQuote}
            onVisualize={handleVisualize}
            isGeneratingImage={state.isGeneratingImage}
            isLoading={state.isLoading}
          />
        )}
      </main>

      <footer className="absolute bottom-8 left-0 right-0 z-10 text-center">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-medium">
          Powered by Gemini &middot; AI Synthesized Inspiration
        </p>
      </footer>
    </div>
  );
};

export default App;
