"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useNotification } from "@/components/Notification";
// Import other components you need

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const notification = useNotification();

  // Other state variables and logic
  const [dashboardLayout, setDashboardLayout] = useState([
    "weather",
    "news",
    "finance",
    // Add other widgets as needed
  ]);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to move a widget in the layout
  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const newLayout = [...dashboardLayout];
    const draggedItem = newLayout[dragIndex];
    // Remove the dragged item and insert it at the new position
    newLayout.splice(dragIndex, 1);
    newLayout.splice(hoverIndex, 0, draggedItem);
    setDashboardLayout(newLayout);
  };

  // Render widget based on type
  const renderWidget = (type: string, index: number) => {
    const content = (() => {
      switch (type) {
        case "weather":
          return <WeatherWidget />;
        case "news":
          return <NewsWidget />;
        case "finance":
          return <FinanceWidget />;
        default:
          return <div>Widget not found</div>;
      }
    })();

    return (
      <motion.div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 m-2 transition-colors duration-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {content}
      </motion.div>
    );
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            {/* Other header elements */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardLayout.map((widgetType, index) =>
            renderWidget(widgetType, index)
          )}
        </div>
      </main>
    </div>
  );
}

// Placeholder components - replace with your actual components
const WeatherWidget = () => (
  <div className="h-64 flex items-center justify-center text-gray-700 dark:text-gray-300">
    Weather Widget
  </div>
);
const NewsWidget = () => (
  <div className="h-64 flex items-center justify-center text-gray-700 dark:text-gray-300">
    News Widget
  </div>
);
const FinanceWidget = () => (
  <div className="h-64 flex items-center justify-center text-gray-700 dark:text-gray-300">
    Finance Widget
  </div>
);
