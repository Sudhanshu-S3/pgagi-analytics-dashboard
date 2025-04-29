import { createSelector } from "reselect";
import { RootState } from "../index";

// Define a proper news item interface based on your API data
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  content: string;
  category: string;
}

// Define the news state interface
export interface NewsState {
  category: string;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  items: NewsItem[];
}

// Base selector to get the news state slice
const selectNewsState = (state: RootState) => state.news;

// Select the current category
export const selectCategory = createSelector(
  selectNewsState,
  (news) => news.category
);

// Select the current search term
export const selectSearchTerm = createSelector(
  selectNewsState,
  (news) => news.searchTerm
);

// Select loading state
export const selectNewsLoading = createSelector(
  selectNewsState,
  (news) => news.isLoading
);

// Select error state
export const selectNewsError = createSelector(
  selectNewsState,
  (news) => news.error
);

// Select all news items
export const selectAllNews = createSelector(
  selectNewsState,
  (news) => news.items
);

// Select news by category
export const selectNewsByCategory = createSelector(
  selectAllNews,
  (_: RootState, category: string) => category,
  (items: NewsItem[], category: string) => items.filter((item: NewsItem) => item.category === category)
);

// Select news filtered by search term
export const selectFilteredNews = createSelector(
  selectAllNews,
  selectSearchTerm,
  (items: NewsItem[], searchTerm: string) => {
    if (!searchTerm) return items;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return items.filter(
      (item: NewsItem) =>
        item.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.description?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
);

// Combined selector for filtered and categorized news
export const selectFilteredNewsByCategory = createSelector(
  selectAllNews,
  selectCategory,
  selectSearchTerm,
  (items: NewsItem[], category: string, searchTerm: string) => {
    let filtered = items;

    // Filter by category if it's not 'all'
    if (category && category !== "all") {
      filtered = filtered.filter((item: NewsItem) => item.category === category);
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

    return filtered;
  }
);
