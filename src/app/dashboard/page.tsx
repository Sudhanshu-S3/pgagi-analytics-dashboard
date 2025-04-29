"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useNotification } from "@/components/Notification";
import Navigation from "@/components/Navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Import actual widget components (replacing placeholders)
import WeatherWidget from "@/components/Weather/WeatherWidget";
import NewsWidget from "@/components/News/NewsWidget";
import FinanceWidget from "@/components/Finance/FinanceWidget";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const notification = useNotification();
  const { theme } = useTheme();

  // Dashboard layout state
  const [dashboardLayout, setDashboardLayout] = useState([
    "weather",
    "news",
    "finance",
  ]);

  // Navigation items
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: "home" },
    { name: "Weather", href: "/weather", icon: "cloud" },
    { name: "News", href: "/news", icon: "newspaper" },
    { name: "Finance", href: "/finance", icon: "chart-line" },
    { name: "Settings", href: "/settings", icon: "cog" },
  ];

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle drag end for widget reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newLayout = [...dashboardLayout];
    const [movedItem] = newLayout.splice(result.source.index, 1);
    newLayout.splice(result.destination.index, 0, movedItem);

    setDashboardLayout(newLayout);

    notification.addNotification({
      title: "Dashboard Updated",
      message: "Widget layout has been saved",
      type: "success",
      duration: 3000,
    });
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="p-5">{content}</div>
      </motion.div>
    );
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 bg-white dark:bg-gray-800 shadow-md lg:h-screen lg:fixed">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                PGAGI Analytics
              </h1>
            </div>
            <Navigation items={navigationItems} />
          </div>

          {/* Main Content */}
          <div className="lg:ml-64 w-full">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() =>
                      notification.addNotification({
                        title: "Welcome!",
                        message: "Use drag and drop to rearrange widgets",
                        type: "info",
                        duration: 5000,
                      })
                    }
                  >
                    Help
                  </button>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="widgets" direction="horizontal">
                  {(provided) => (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {dashboardLayout.map((widgetType, index) => (
                        <Draggable
                          key={widgetType}
                          draggableId={widgetType}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {renderWidget(widgetType, index)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center text-gray-500 dark:text-gray-400">
              <div className="max-w-7xl mx-auto px-4">
                <p>© {new Date().getFullYear()} PGAGI Analytics Dashboard</p>
              </div>
            </footer>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}
