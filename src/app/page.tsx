import { QueryClient, dehydrate } from "@tanstack/react-query";
import { prefetchWeatherData } from "@/hooks/useWeatherData";
import { prefetchNewsData } from "@/hooks/useNewsData";
import { prefetchStockData } from "@/hooks/useFinanceData";
import { HydrationBoundary } from "@tanstack/react-query";
import DashboardPage from "@/app/dashboard/page";

export default async function HomePage() {
  // Default coordinates for New York
  const coordinates = { lat: 40.7128, lon: -74.006 };

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

  // Wrap DashboardPage with HydrationBoundary to pass the dehydratedState
  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardPage />
    </HydrationBoundary>
  );
}
