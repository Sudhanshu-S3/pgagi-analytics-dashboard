"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useStockData } from "@/hooks/useFinanceData";

// Dynamically import StockChart with SSR disabled
const StockChart = dynamic(() => import("./StockChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
  ),
});

const FinanceWidget: React.FC = () => {
  const { data: financeData, isLoading, isError } = useStockData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1m"); // Options: 1d, 1w, 1m, 1y

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900 p-4 text-red-700 dark:text-red-100">
        Error loading financial data.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Market Overview</h3>
        <div className="flex space-x-2">
          {["1d", "1w", "1m", "1y"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-2 py-1 text-sm rounded ${
                selectedTimeframe === timeframe
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <StockChart data={financeData} />

      <div className="mt-4 grid grid-cols-2 gap-4">
        {financeData?.stocks?.map((stock: any) => (
          <div
            key={stock.symbol}
            className="flex justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div>
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {stock.name}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium">${stock.price}</span>
              <span
                className={`text-xs ${
                  stock.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stock.change > 0 ? "+" : ""}
                {stock.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Market summary footer */}
      {financeData?.marketSummary && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>S&P 500:</span>
            <span
              className={
                financeData.marketSummary.sp500Change >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {financeData.marketSummary.sp500} (
              {financeData.marketSummary.sp500Change > 0 ? "+" : ""}
              {financeData.marketSummary.sp500Change}%)
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Updated:</span>
            <span>{new Date(financeData.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceWidget;
