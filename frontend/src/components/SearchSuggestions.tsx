import { useEffect, useRef } from "react";
import { Clock, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  onRemove?: (suggestion: string) => void;
  onClear?: () => void;
  isVisible?: boolean;
  className?: string;
}

const SearchSuggestions = ({
  suggestions,
  onSelect,
  onRemove,
  onClear,
  isVisible = false,
  className,
}: SearchSuggestionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible || event.target instanceof HTMLInputElement) return;

      if (event.key === "Escape") {
        // Handle escape to close suggestions
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl max-h-80 overflow-y-auto",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Searches
          </h3>
          {onClear && (
            <button
              onClick={onClear}
              className="text-xs text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion}-${index}`}
              className="group flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => onSelect(suggestion)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-white truncate">{suggestion}</span>
              </div>

              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(suggestion);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all duration-200"
                  aria-label={`Remove "${suggestion}" from search history`}
                >
                  <X className="w-3 h-3 text-zinc-400 hover:text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
