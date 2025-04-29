import { useQuery } from "@tanstack/react-query";
import { NewsItem } from "@/services/api";

// API function for fetching news data
const fetchNews = async (category: string): Promise<NewsItem[]> => {
  const response = await fetch(`/api/news?category=${category}`);

  if (!response.ok) throw new Error("Failed to fetch news data");
  return response.json();
};

// Custom hook for news data
export function useNewsData(category: string = "general") {
  return useQuery({
    queryKey: ["news", category],
    queryFn: () => fetchNews(category),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
}

// Prefetch function for SSR/SSG
export const prefetchNewsData = async (
  queryClient: any,
  category: string = "general"
) => {
  await queryClient.prefetchQuery({
    queryKey: ["news", category],
    queryFn: () => fetchNews(category),
  });
};
