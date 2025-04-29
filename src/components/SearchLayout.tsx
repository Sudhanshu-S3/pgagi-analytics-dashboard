import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../store/slices/newsSlice";
import SearchBar from "./SearchBar";
import AdvancedFilter from "./AdvancedFilter";

interface SearchLayoutProps {
  children: React.ReactNode;
  suggestions?: string[];
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filters: any) => void;
}

const SearchLayout = ({
  children,
  suggestions = [],
  onSearch,
  onFilter,
}: SearchLayoutProps) => {
  const dispatch = useDispatch();
  const [activeFilters, setActiveFilters] = useState<any>({});

  // Handle combined search criteria (both search term and filters)
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    if (onFilter) {
      onFilter(filters);
    }
  };

  // Custom search handler
  const handleSearch = (term: string) => {
    if (onSearch) {
      onSearch(term);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-2/3">
            <SearchBar
              suggestions={suggestions}
              className="w-full"
              debounceTime={500}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm mt-2 md:mt-0">
            <span className="text-gray-500 dark:text-gray-400">
              {Object.values(activeFilters).flat().filter(Boolean).length > 0
                ? `${
                    Object.values(activeFilters).flat().filter(Boolean).length
                  } filters active`
                : "No filters applied"}
            </span>
            {Object.values(activeFilters).flat().filter(Boolean).length > 0 && (
              <button
                onClick={() => handleFilterChange({})}
                className="text-blue-500 hover:text-blue-700"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <AdvancedFilter onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Content area */}
      <div>{children}</div>
    </div>
  );
};

export default SearchLayout;
