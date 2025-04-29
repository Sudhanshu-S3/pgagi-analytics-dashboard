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
} from "recharts";
import { fetchWeatherData } from "@/hooks/useWeatherData";

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
  // Initialize with default coordinates instead of null
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 40.7128, // New York as default
    lon: -74.006,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
          // Already using default coordinates, no need to set again
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

  // Prefetch nearby cities weather data when a city is selected
  const prefetchNearbyCities = async (
    currentLat: number,
    currentLon: number
  ) => {
    // Prefetch weather for cities approximately 1 degree in each direction
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
    // Prefetch nearby cities in the background
    prefetchNearbyCities(city.lat, city.lon);
  };

  // Prepare chart data
  const chartData = weatherData?.daily.map((day) => ({
    date: new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    temperature: day.temp.day,
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative">
      {/* Show loading overlay during refetching */}
      {isRefetching && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="animate-pulse text-lg">Refreshing data...</div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {isSearchLoading && debouncedQuery.length >= 3 && (
          <div className="p-2 text-gray-500">Searching cities...</div>
        )}

        {cityResults && cityResults.length > 0 && searchQuery && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
            {cityResults.map((city) => (
              <li
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isWeatherLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-xl">Loading weather data...</div>
        </div>
      ) : weatherError ? (
        <div className="text-red-500 p-4">
          Error loading weather data. Please try again later.
        </div>
      ) : weatherData ? (
        <>
          {/* Current weather */}
          <div className="flex items-center mb-4">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
              alt={weatherData.current.weather[0].description}
              className="w-16 h-16"
            />
            <div className="ml-4">
              <div className="text-3xl font-bold">
                {Math.round(weatherData.current.temp)}°C
              </div>
              <div className="text-gray-700">
                {weatherData.current.weather[0].description}
              </div>
              <div className="text-sm text-gray-600">
                Humidity: {weatherData.current.humidity}% | Wind:{" "}
                {weatherData.current.wind_speed} m/s
              </div>
            </div>
          </div>

          {/* 7-day forecast chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherCard;
