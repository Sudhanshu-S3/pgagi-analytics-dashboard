import { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search for:", query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-colors duration-200"
          placeholder="Search for anything..."
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
      </div>
    </form>
  );
};

export default SearchBar;
