import { QueryClient, dehydrate } from "@tanstack/react-query";
import { prefetchWeatherData } from "@/hooks/useWeatherData";
import DashboardWithProvider from "./dashboard/page"; // Importing your client component
import { HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  // Default coordinates for New York
  const coordinates = { lat: 40.7128, lon: -74.006 };

  // Create a new QueryClient for server-side prefetching
  const queryClient = new QueryClient();

  // Prefetch weather data
  await prefetchWeatherData(queryClient, coordinates);

  // Properly dehydrate the query cache
  const dehydratedState = dehydrate(queryClient);

  // Wrap DashboardWithProvider with HydrationBoundary to pass the dehydratedState
  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardWithProvider />
    </HydrationBoundary>
  );
}
