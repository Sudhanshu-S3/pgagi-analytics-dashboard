import React, { useState } from "react";
import {
  useGetStockQuoteQuery,
  useGetStockTimeSeriesQuery,
  useSearchStockSymbolsQuery,
} from "@/services/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = () => {
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [timeInterval, setTimeInterval] = useState<string>("1m"); // '1d', '1w', '1m', '1y'

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Queries
  const { data: quoteData, isLoading: isQuoteLoading } =
    useGetStockQuoteQuery(symbol);
  const { data: timeSeriesData, isLoading: isTimeSeriesLoading } =
    useGetStockTimeSeriesQuery({ symbol, interval: timeInterval });
  const { data: searchResults } = useSearchStockSymbolsQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  });

  // Handle stock selection
  const handleStockSelect = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setSearchQuery("");
  };

  // Prepare chart data
  const chartData = {
    labels:
      timeSeriesData?.values.map((item) => {
        const date = new Date(item.datetime);
        return timeInterval === "1d"
          ? date.toLocaleTimeString()
          : date.toLocaleDateString();
      }) || [],
    datasets: [
      {
        label: symbol,
        data:
          timeSeriesData?.values.map((item) => parseFloat(item.close)) || [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {searchResults && searchResults.length > 0 && searchQuery && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
            {searchResults.map((result) => (
              <li
                key={result.symbol}
                onClick={() => handleStockSelect(result.symbol)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="font-bold">{result.symbol}</span>:{" "}
                {result.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Time interval buttons */}
      <div className="flex gap-2 mb-4">
        {["1d", "1w", "1m", "1y"].map((interval) => (
          <button
            key={interval}
            onClick={() => setTimeInterval(interval)}
            className={`px-3 py-1 rounded ${
              timeInterval === interval
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {interval}
          </button>
        ))}
      </div>

      {/* Stock info */}
      {quoteData && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{symbol}</h2>
          <div className="flex items-center">
            <div className="text-3xl">${quoteData.price.toFixed(2)}</div>
            <div
              className={`ml-2 ${
                quoteData.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {quoteData.change >= 0 ? "+" : ""}
              {quoteData.change.toFixed(2)} (
              {quoteData.changePercent.toFixed(2)}%)
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
            <div>Open: ${quoteData.open.toFixed(2)}</div>
            <div>High: ${quoteData.high.toFixed(2)}</div>
            <div>Low: ${quoteData.low.toFixed(2)}</div>
            <div>Vol: {(quoteData.volume / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        {isTimeSeriesLoading ? (
          <div className="flex justify-center items-center h-full">
            <div>Loading chart data...</div>
          </div>
        ) : timeSeriesData && timeSeriesData.values.length > 0 ? (
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div>No data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;
