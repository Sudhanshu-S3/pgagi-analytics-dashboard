import React, { useState, useEffect } from "react";
import { useGetWeatherQuery, useSearchCitiesQuery } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define interface for coordinates
interface Coordinates {
  lat: number;
  lon: number;
}

const WeatherCard = () => {
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

  // Query weather data with proper skip condition
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useGetWeatherQuery(coordinates);

  // Query city search results
  const { data: cityResults } = useSearchCitiesQuery(debouncedQuery, {
    skip: debouncedQuery.length < 3,
  });

  // Handle city selection
  const handleCitySelect = (city: any) => {
    setCoordinates({ lat: city.lat, lon: city.lon });
    setSearchQuery(city.name);
  };

  // Prepare chart data
  const chartData = weatherData?.daily.map((day) => ({
    date: new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    temperature: day.temp.day,
  }));

  if (isWeatherLoading) return <div>Loading weather data...</div>;
  if (weatherError) return <div>Error loading weather data</div>;
  if (!weatherData) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

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
    </div>
  );
};

// Add default export
export default WeatherCard;
