import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define the NewsItem interface locally
interface NewsItem {
  title?: string;
  description?: string;
  publishedAt?: string;
  source?: string;
  category?: string;
  tags?: string[];
}

// Helper function to check if a date is within a range
const isWithinDateRange = (
  date: string | undefined,
  start: string | null,
  end: string | null
): boolean => {
  if (!date) return false;
  const itemDate = new Date(date);

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return itemDate >= startDate && itemDate <= endDate;
  } else if (start) {
    const startDate = new Date(start);
    return itemDate >= startDate;
  } else if (end) {
    const endDate = new Date(end);
    return itemDate <= endDate;
  }

  return true;
};

// Define the filter options interface
interface NewsFilterOptions {
  dateRange?: { start: string | null; end: string | null };
  sources?: string[];
  tags?: string[];
}

export const selectFilteredNews = createSelector(
  [
    (state: RootState) => state.news.items,
    (state: RootState) => state.news.searchTerm,
    (state: RootState) => state.news.category,
    (_state: RootState, options: NewsFilterOptions = {}) => options,
  ],
  (items, searchTerm, category, options) => {
    const { dateRange, sources, tags } = options;
    let filtered = [...items];

    // Filter by category if present
    if (category && category !== "all") {
      filtered = filtered.filter(
        (item: NewsItem) => item.category === category
      );
    }

    // Filter by search term if present
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item: NewsItem) =>
          item.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.description?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Filter by date range if present
    if (dateRange && (dateRange.start || dateRange.end)) {
      filtered = filtered.filter((item: NewsItem) =>
        isWithinDateRange(item.publishedAt, dateRange.start, dateRange.end)
      );
    }

    // Filter by sources if present
    if (sources && sources.length > 0) {
      filtered = filtered.filter(
        (item: NewsItem) => item.source && sources.includes(item.source)
      );
    }

    // Filter by tags if present
    if (tags && tags.length > 0) {
      filtered = filtered.filter(
        (item: NewsItem) =>
          item.tags && tags.some((tag: string) => item.tags?.includes(tag))
      );
    }

    return filtered;
  }
);
