import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSearchHistory } from "@/hooks/useSearchHistory";

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  variant?: "compact" | "full";
}

const GlobalSearch = ({
  className,
  placeholder = "Search songs, artists...",
  variant = "compact",
}: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { addToHistory } = useSearchHistory();

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
      navigate("/browse", { state: { searchQuery: searchQuery.trim() } });
      setIsExpanded(false);
      setQuery("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsExpanded(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (variant === "compact") {
    return (
      <div className={cn("relative", className)}>
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              "relative flex items-center transition-all duration-300 ease-in-out",
              isExpanded ? "w-48 sm:w-64" : "w-8 sm:w-10"
            )}
          >
            {/* Search icon button */}
            <button
              type="button"
              onClick={() => {
                if (isExpanded) {
                  inputRef.current?.focus();
                } else {
                  setIsExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
              className={cn(
                "absolute left-0 z-10 p-2 text-zinc-400 hover:text-white transition-colors duration-200",
                isExpanded && "hover:text-red-400"
              )}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Expandable input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={cn(
                "w-full bg-zinc-900/50 border border-white/20 rounded-full py-1.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/30 transition-all duration-300 hover:bg-zinc-800/50",
                isExpanded
                  ? "pl-10 pr-10 opacity-100"
                  : "pl-8 pr-8 opacity-0 pointer-events-none"
              )}
            />

            {/* Clear button */}
            {isExpanded && query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 z-10 p-1 text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Keyboard shortcut hint */}
          {!isExpanded && (
            <div className="absolute top-full left-0 mt-1 hidden lg:block">
              <span className="text-xs text-zinc-500 bg-black/60 px-2 py-1 rounded border border-white/10">
                ⌘K
              </span>
            </div>
          )}
        </form>
      </div>
    );
  }

  // Full variant for mobile or when needed
  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full bg-zinc-900/50 backdrop-blur-sm border border-white/20 rounded-full py-2 pl-10 pr-20 text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/30 transition-all duration-200 hover:bg-zinc-800/50 text-sm"
          />

          {/* Keyboard shortcut hint */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            {query ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="h-3 w-3 text-zinc-400 hover:text-white" />
              </button>
            ) : (
              <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded border border-white/10">
                ⌘K
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default GlobalSearch;
