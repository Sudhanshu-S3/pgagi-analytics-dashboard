"use client";

import React, { useState, useEffect } from "react";
import { useWeatherData, useSearchCities } from "@/hooks/useWeatherData";
import { useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { fetchWeatherData } from "@/hooks/useWeatherData";
import { motion } from "framer-motion";

// Define interface for coordinates
interface Coordinates {
  lat: number;
  lon: number;
}

interface CityResult {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

const WeatherCard = () => {
  const queryClient = useQueryClient();
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 40.7128, // New York as default
    lon: -74.006,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Query weather data with React Query
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
    isRefetching,
  } = useWeatherData(coordinates);

  // Query city search results
  const { data: cityResults, isLoading: isSearchLoading } =
    useSearchCities(debouncedQuery);

  // Prefetch nearby cities weather data
  const prefetchNearbyCities = async (
    currentLat: number,
    currentLon: number
  ) => {
    const nearbyCoordinates = [
      { lat: currentLat + 1, lon: currentLon },
      { lat: currentLat - 1, lon: currentLon },
      { lat: currentLat, lon: currentLon + 1 },
      { lat: currentLat, lon: currentLon - 1 },
    ];

    nearbyCoordinates.forEach((coords) => {
      queryClient.prefetchQuery({
        queryKey: ["weather", coords.lat, coords.lon],
        queryFn: () => fetchWeatherData(coords),
      });
    });
  };

  // Handle city selection
  const handleCitySelect = (city: CityResult) => {
    setCoordinates({ lat: city.lat, lon: city.lon });
    setSearchQuery(city.name);
    setIsSearchOpen(false);
    prefetchNearbyCities(city.lat, city.lon);
  };

  // Prepare chart data
  const chartData = weatherData?.daily?.map((day) => ({
    date: new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    temperature: day.temp.day,
    min: day.temp.min,
    max: day.temp.max,
  }));

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Weather Forecast
        </h2>
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-300"
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
          </button>

          {isSearchOpen && (
            <motion.div
              className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  autoFocus
                />
              </div>

              {isSearchLoading && debouncedQuery.length >= 3 && (
                <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                  Searching cities...
                </div>
              )}

              {cityResults && cityResults.length > 0 && searchQuery && (
                <ul className="max-h-60 overflow-auto">
                  {cityResults.map((city) => (
                    <li
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {city.country}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {debouncedQuery.length >= 3 &&
                cityResults?.length === 0 &&
                !isSearchLoading && (
                  <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                    No cities found
                  </div>
                )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isWeatherLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading weather data...
          </p>
        </div>
      ) : weatherError ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
          <p className="font-medium">Error loading weather data</p>
          <p className="text-sm mt-1">
            Please try again later or check your connection.
          </p>
        </div>
      ) : weatherData ? (
        <>
          {/* Overlay for refetching */}
          {isRefetching && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
              <div className="animate-pulse flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-blue-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="mt-2 text-gray-700 dark:text-gray-300">
                  Updating...
                </span>
              </div>
            </div>
          )}

          {/* Current weather */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-4 flex items-center">
            <div className="flex-shrink-0">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                alt={weatherData.current.weather[0].description}
                className="w-16 h-16"
              />
            </div>
            <div className="ml-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                  {Math.round(weatherData.current.temp)}°C
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Feels like {Math.round((weatherData.current as any).feels_like || weatherData.current.temp)}°C
                </span>
              </div>
              <div className="capitalize text-gray-700 dark:text-gray-300">
                {weatherData.current.weather[0].description}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="inline-flex items-center mr-3">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Humidity: {weatherData.current.humidity}%
                </span>
                <span className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Wind: {Math.round(weatherData.current.wind_speed)} m/s
                </span>
              </div>
            </div>
          </div>

          {/* 7-day forecast chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              7-Day Temperature Forecast
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(128,128,128,0.2)"
                  />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis width={30} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#333" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6, fill: "#2563eb" }}
                  />
                  <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherCard;
