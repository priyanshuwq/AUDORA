import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchSuggestions from "./SearchSuggestions";
import BouncingBall from "./BouncingBall";

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  onSuggestionRemove?: (suggestion: string) => void;
  onClearSuggestions?: () => void;
}

export interface SearchInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (
    {
      onSearch,
      onClear,
      isLoading = false,
      placeholder = "Search for songs, artists...",
      className,
      autoFocus = false,
      suggestions = [],
      onSuggestionSelect,
      onSuggestionRemove,
      onClearSuggestions,
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: handleClear,
    }));

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
      setShowSuggestions(suggestions.length > 0 && value.length === 0);
    };

    const handleClear = () => {
      setQuery("");
      onClear();
      setShowSuggestions(false);
      inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
      setShowSuggestions(false);
    };

    const handleFocus = () => {
      setIsFocused(true);
      setShowSuggestions(suggestions.length > 0 && query.length === 0);
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Delay hiding suggestions to allow clicking on them
      setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleSuggestionSelect = (suggestion: string) => {
      setQuery(suggestion);
      onSearch(suggestion);
      setShowSuggestions(false);
      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
      }
    };

    return (
      <form onSubmit={handleSubmit} className={cn("relative", className)}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="scale-50">
                <BouncingBall size="sm" />
              </div>
            ) : (
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-red-400 transition-colors duration-200" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-full py-4 pl-12 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 hover:bg-black/30"
            disabled={isLoading}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-red-500/10 rounded-full p-1 transition-colors duration-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-zinc-400 hover:text-white" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          onRemove={onSuggestionRemove}
          onClear={onClearSuggestions}
          isVisible={showSuggestions && (isFocused || suggestions.length > 0)}
        />
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
