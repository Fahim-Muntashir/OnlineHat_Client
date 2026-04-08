"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { getAiSuggestions } from "@/lib/suggestions-data";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
  className?: string;
}

export function SearchSuggestions({
  query,
  onSelect,
  isVisible,
  className,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isVisible) return;
      
      setIsLoading(true);
      try {
        const results = await getAiSuggestions(debouncedQuery);
        setSuggestions(results);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, isVisible]);

  if (!isVisible || (suggestions.length === 0 && !isLoading)) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      <div className="p-2">
        {isLoading && suggestions.length === 0 ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 flex-1 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              {query ? (
                <>
                  <Sparkles size={11} className="text-primary" />
                  AI Suggestions
                </>
              ) : (
                <>
                  <TrendingUp size={11} className="text-primary" />
                  Popular Searches
                </>
              )}
            </div>
            <div className="space-y-0.5">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(suggestion)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group"
                >
                  <Search
                    size={14}
                    className="text-slate-300 group-hover:text-primary transition-colors"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {query && (
        <div className="bg-slate-50/50 px-4 py-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center italic">
            Suggestions powered by AI based on your interests
          </p>
        </div>
      )}
    </div>
  );
}
