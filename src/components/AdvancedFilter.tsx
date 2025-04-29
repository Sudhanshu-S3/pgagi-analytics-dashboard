import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../store/slices/newsSlice";
import { RootState } from "../store/store";

interface FilterCriteria {
  category: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  sources: string[];
  tags: string[];
}

interface AdvancedFilterProps {
  onFilterChange?: (criteria: FilterCriteria) => void;
  availableCategories?: string[];
  availableSources?: string[];
  availableTags?: string[];
}

const AdvancedFilter = ({
  onFilterChange,
  availableCategories = [
    "all",
    "business",
    "technology",
    "health",
    "sports",
    "entertainment",
  ],
  availableSources = ["CNN", "BBC", "Reuters", "Bloomberg", "CNBC"],
  availableTags = ["trending", "important", "breaking", "analysis", "opinion"],
}: AdvancedFilterProps) => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.news.searchTerm);

  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    category: "all",
    dateRange: {
      start: null,
      end: null,
    },
    sources: [],
    tags: [],
  });

  // Apply filters when they change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value || null,
      },
    }));
  };

  const handleSourceToggle = (source: string) => {
    setFilters((prev) => {
      const sourceExists = prev.sources.includes(source);

      return {
        ...prev,
        sources: sourceExists
          ? prev.sources.filter((s) => s !== source)
          : [...prev.sources, source],
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => {
      const tagExists = prev.tags.includes(tag);

      return {
        ...prev,
        tags: tagExists
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      dateRange: {
        start: null,
        end: null,
      },
      sources: [],
      tags: [],
    });
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          className="text-blue-500 hover:text-blue-700 text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide" : "Show"} advanced filters
        </button>
      </div>

      <div
        className={`mt-4 transition-all duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filters.dateRange.start || ""}
                onChange={(e) => handleDateChange("start", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              />
              <span className="self-center">-</span>
              <input
                type="date"
                value={filters.dateRange.end || ""}
                onChange={(e) => handleDateChange("end", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sources
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSources.map((source) => (
              <div
                key={source}
                onClick={() => handleSourceToggle(source)}
                className={`px-3 py-1 rounded-full cursor-pointer text-sm 
                  ${
                    filters.sources.includes(source)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
              >
                {source}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <div
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full cursor-pointer text-sm
                  ${
                    filters.tags.includes(tag)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Clear All
          </button>
          <button
            onClick={() => onFilterChange && onFilterChange(filters)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
