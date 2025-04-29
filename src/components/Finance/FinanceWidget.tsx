"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useStockData } from "@/hooks/useFinanceData";
import { motion } from "framer-motion";

// Dynamically import StockChart with SSR disabled
const StockChart = dynamic(() => import("./StockChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
  ),
});

const FinanceWidget: React.FC = () => {
  const { data: financeData, isLoading, isError } = useStockData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1m");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-5">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-sm">
            We couldn't load the financial data. Please check your internet
            connection and try again.
          </p>
          <button className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-lg bg-white dark:bg-gray-800 shadow-md p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Market Overview
        </h3>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex space-x-1">
          {["1d", "1w", "1m", "1y"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <motion.div className="mb-6" variants={itemVariants}>
        <StockChart data={financeData} />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        variants={itemVariants}
      >
        {financeData?.stocks?.map((stock: any) => (
          <motion.div
            key={stock.symbol}
            className="flex justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              <div className="flex items-center">
                <span className="font-bold text-gray-800 dark:text-white">
                  {stock.symbol}
                </span>
                {stock.change >= 1 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded">
                    Hot
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                {stock.name}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium text-gray-800 dark:text-white">
                ${stock.price}
              </span>
              <span
                className={`text-xs font-medium ${
                  stock.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stock.change > 0 ? "+" : ""}
                {stock.change}%
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Market summary footer */}
      {financeData?.marketSummary && (
        <motion.div
          className="pt-4 border-t border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  S&P 500
                </span>
                <span
                  className={`font-medium ${
                    financeData.marketSummary.sp500Change >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {financeData.marketSummary.sp500} (
                  {financeData.marketSummary.sp500Change > 0 ? "+" : ""}
                  {financeData.marketSummary.sp500Change}%)
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Updated
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {new Date(financeData.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinanceWidget;
