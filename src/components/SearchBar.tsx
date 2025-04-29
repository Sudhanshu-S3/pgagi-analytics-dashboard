import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../store/slices/newsSlice";

interface SearchBarProps {
  placeholder?: string;
  suggestions?: string[];
  className?: string;
  debounceTime?: number; // Time in ms to wait before applying the search
}

const SearchBar = ({
  placeholder = "Search for anything...",
  suggestions = [],
  className = "",
  debounceTime = 500,
}: SearchBarProps) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to dispatch after debounce time
    debounceTimerRef.current = setTimeout(() => {
      dispatch(setSearchTerm(value));
    }, debounceTime);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    dispatch(setSearchTerm(suggestion));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(query));
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors duration-200"
            placeholder={placeholder}
            aria-label="Search"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setQuery("");
                dispatch(setSearchTerm(""));
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
