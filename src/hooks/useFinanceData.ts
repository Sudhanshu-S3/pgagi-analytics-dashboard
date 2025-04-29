import { useQuery } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

// Mock data if API is not available
const mockFinanceData = {
  chartData: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ],
    values: [125, 132, 141, 138, 146, 152, 158, 153, 162, 168],
  },
  stocks: [
    { symbol: "AAPL", name: "Apple Inc.", price: "189.30", change: 0.86 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "415.50", change: 1.24 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "177.80", change: -0.31 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "187.50", change: 0.67 },
    { symbol: "META", name: "Meta Platforms", price: "497.20", change: 2.14 },
    { symbol: "TSLA", name: "Tesla Inc.", price: "175.30", change: -1.45 },
  ],
  marketSummary: {
    sp500: "5,321.41",
    sp500Change: 0.53,
    nasdaq: "16,742.39",
    nasdaqChange: 0.78,
  },
  lastUpdated: new Date().toISOString(),
};

// Function to fetch stock data
async function fetchStockData() {
  try {
    // Replace with your actual API call
    // const response = await fetch("your-api-endpoint");
    // return await response.json();

    // Using mock data for now
    return mockFinanceData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw new Error("Failed to fetch stock data");
  }
}

// Hook for client-side data fetching
export function useStockData() {
  return useQuery({
    queryKey: ["stockData"],
    queryFn: fetchStockData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Function for server-side prefetching
export async function prefetchStockData(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: ["stockData"],
    queryFn: fetchStockData,
  });
}
