
export interface Quote {
  text: string;
  author: string;
  context?: string;
  category: string;
}

export interface AppState {
  quote: Quote | null;
  isLoading: boolean;
  error: string | null;
  backgroundImage: string | null;
  isGeneratingImage: boolean;
}
