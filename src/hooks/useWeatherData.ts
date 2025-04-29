import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WeatherData, CitySearchResult } from "@/services/api";

// API functions (existing code)
export const fetchWeatherData = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<WeatherData> => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY}`
  );

  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
};

export const searchCities = async (query: string): Promise<CitySearchResult[]> => {
  if (query.length < 3) return [];

  const response = await fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to search cities");
  const data = await response.json();
  return data.data;
};

// Custom hooks - update with enhanced caching strategies
export function useWeatherData({ lat, lon }: { lat: number; lon: number }) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeatherData({ lat, lon }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
  });
}

export function useSearchCities(query: string) {
  return useQuery({
    queryKey: ["cities", query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// Add cache invalidation mutation
export function useUpdateWeatherPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: { unit: "celsius" | "fahrenheit" }) => {
      localStorage.setItem("weatherPreferences", JSON.stringify(preferences));
      return preferences;
    },
    onSuccess: () => {
      // Invalidate and refetch weather queries after preferences change
      queryClient.invalidateQueries({ queryKey: ["weather"] });
    },
  });
}

// Expand existing prefetch function
export const prefetchWeatherData = async (
  queryClient: any,
  coordinates: { lat: number; lon: number }
) => {
  await queryClient.prefetchQuery({
    queryKey: ["weather", coordinates.lat, coordinates.lon],
    queryFn: () => fetchWeatherData(coordinates),
    staleTime: 10 * 60 * 1000,
  });
};