import { dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";
import { prefetchWeatherData } from "@/hooks/useWeatherData";
import { prefetchNewsData } from "@/hooks/useNewsData";
import { prefetchStockData } from "@/hooks/useFinanceData";
import WeatherWidget from "@/components/Weather/WeatherCard";
import NewsWidget from "@/components/News/NewsWidget";
import FinanceWidget from "@/components/Finance/FinanceWidget";
import { Suspense } from "react";

const LoadingWeatherWidget = () => (
  <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
);

const LoadingNewsWidget = () => (
  <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
);

const LoadingFinanceWidget = () => (
  <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
);

export default async function DashboardPage() {
  // Default coordinates for New York
  const coordinates = {
    lat: 40.7128,
    lon: -74.006,
  };

  // Create a new QueryClient for server-side prefetching
  const queryClient = new QueryClient();

  // Prefetch all necessary data in parallel
  await Promise.all([
    prefetchWeatherData(queryClient, coordinates),
    prefetchNewsData(queryClient),
    prefetchStockData(queryClient),
  ]);

  // Properly dehydrate the query cache
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Weather</h2>
          <Suspense fallback={<LoadingWeatherWidget />}>
            <WeatherWidget />
          </Suspense>
        </div>

        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Latest News</h2>
          <Suspense fallback={<LoadingNewsWidget />}>
            <NewsWidget />
          </Suspense>
        </div>

        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Financial Overview</h2>
          <Suspense fallback={<LoadingFinanceWidget />}>
            <FinanceWidget />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
