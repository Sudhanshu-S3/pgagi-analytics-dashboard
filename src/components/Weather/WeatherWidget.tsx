import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setLoading, setError } from "../../store/slices/weatherSlice";
import ErrorBoundary from "../common/ErrorBoundary";
import SkeletonLoader from "../common/SkeletonLoader";
import ErrorMessage from "../common/ErrorMessage";
import useErrorHandler from "../../hooks/useErrorHandler";

const WeatherWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { handleError } = useErrorHandler();
  const { selectedLocation, isLoading, error, unit } = useSelector(
    (state: RootState) => state.weather
  );

  const fetchWeatherData = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null)); // Clear previous errors

      if (!selectedLocation) {
        throw new Error("No location selected");
      }

      // Replace with your actual API call
      const response = await fetch(
        `https://api.example.com/weather?location=${selectedLocation}&unit=${unit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }

      const data = await response.json();
      // Process data here

      dispatch(setLoading(false));
    } catch (error) {
      // Use our error handler
      handleError(error instanceof Error ? error : String(error), "weather");
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData();
    }
  }, [selectedLocation, unit]);

  const handleRetry = () => {
    fetchWeatherData();
  };

  // Return loading state
  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <SkeletonLoader type="stats" columns={2} />
        <div className="mt-4">
          <SkeletonLoader type="chart" height="h-40" />
        </div>
      </div>
    );
  }

  // Return error state
  if (error) {
    return (
      <ErrorMessage
        message={error}
        severity="error"
        onRetry={handleRetry}
        className="w-full"
      />
    );
  }

  // Main component render
  return (
    <ErrorBoundary
      onError={(error) =>
        handleError(error, "weather", { reportToAnalytics: true })
      }
      resetKeys={[selectedLocation, unit]}
    >
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Weather content here */}
        <h2 className="text-xl font-semibold mb-4">
          Weather for {selectedLocation}
        </h2>
        {/* Weather data display */}
      </div>
    </ErrorBoundary>
  );
};

export default WeatherWidget;
