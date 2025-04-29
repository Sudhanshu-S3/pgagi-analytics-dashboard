"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import SearchBar from "@/components/SearchBar";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
  useNotification,
  NotificationProvider,
} from "@/components/Notification";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import DraggableWidget from "@/components/DraggableWidget";
import { Provider } from "react-redux";
import { store } from "@/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

const WeatherWidget = dynamic(
  () => import("@/components/Weather/WeatherCard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    ),
  }
);

const NewsWidget = dynamic(() => import("@/components/News/NewsFeed"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
  ),
});

const FinanceWidget = dynamic(() => import("@/components/Finance/StockChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
  ),
});

function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notification = useNotification();

  // Dashboard layout state - persisted in localStorage
  const [dashboardLayout, setDashboardLayout] = useState<string[]>([
    "weather",
    "finance",
    "news",
  ]);

  // Wait until mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      // Load layout from localStorage if available
      const savedLayout = localStorage.getItem("dashboardLayout");
      if (savedLayout) {
        try {
          setDashboardLayout(JSON.parse(savedLayout));
        } catch (e) {
          console.error("Error parsing saved layout", e);
        }
      }
    }

    // Show welcome notification after a short delay
    const timer = setTimeout(() => {
      notification.addNotification({
        title: "Welcome back!",
        message:
          "Your dashboard is ready. Drag widgets to customize your layout.",
        type: "info",
        duration: 5000,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [notification]);

  // Save layout to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dashboardLayout", JSON.stringify(dashboardLayout));
    }
  }, [dashboardLayout, mounted]);

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: "home", href: "/" },
    { name: "Weather", icon: "cloud", href: "#weather" },
    { name: "News", icon: "newspaper", href: "#news" },
    { name: "Finance", icon: "chart-line", href: "#finance" },
    { name: "Settings", icon: "cog", href: "/settings" },
  ];

  // Function to move a widget in the layout
  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const newLayout = [...dashboardLayout];
    const draggedItem = newLayout[dragIndex];

    // Remove the dragged item and insert it at the new position
    newLayout.splice(dragIndex, 1);
    newLayout.splice(hoverIndex, 0, draggedItem);

    setDashboardLayout(newLayout);
  };

  // Handle theme toggle with animation
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");

    // Show notification on theme change
    notification.addNotification({
      title: `${theme === "dark" ? "Light" : "Dark"} theme activated`,
      message: `You've switched to ${
        theme === "dark" ? "light" : "dark"
      } mode.`,
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
        case "finance":
          return <FinanceWidget />;
        case "news":
          return <NewsWidget />;
        default:
          return null;
      }
    })();

    if (!content) return null;

    const title = (() => {
      switch (type) {
        case "weather":
          return "Weather";
        case "finance":
          return "Financial Overview";
        case "news":
          return "Latest News";
        default:
          return "Widget";
      }
    })();

    return (
      <DraggableWidget
        key={`${type}-${index}`}
        id={`widget-${type}`}
        index={index}
        title={title}
        moveWidget={moveWidget}
      >
        {content}
      </DraggableWidget>
    );
  };

  if (!mounted) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary dark:text-white">
                Analytics Dashboard
              </h1>
            </div>

            <div className="hidden md:flex md:flex-1 justify-center px-4">
              <SearchBar />
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                aria-label="Toggle theme"
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? (
                  <motion.svg
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-5 w-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </motion.svg>
                )}
              </motion.button>

              {/* Notification bell */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                aria-label="View notifications"
                onClick={() =>
                  notification.addNotification({
                    title: "New notification",
                    message: "This is a sample notification.",
                    type: "info",
                  })
                }
              >
                <svg
                  className="h-5 w-5 text-gray-600 dark:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              <ProfileDropdown />
            </div>
          </div>

          {/* Mobile search (visible on small screens) */}
          <div className="md:hidden px-4 py-2">
            <SearchBar />
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
            <nav className="sticky top-[60px] p-4 h-[calc(100vh-60px)] overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="flex items-center px-4 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      aria-current={
                        item.name === "Dashboard" ? "page" : undefined
                      }
                    >
                      <span className="mr-3 text-gray-500 dark:text-gray-400">
                        {/* Icon placeholder */}
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Mobile navigation menu */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className="bg-white dark:bg-gray-800 w-64 h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Close menu"
                  >
                    <svg
                      className="h-6 w-6 text-gray-600 dark:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <nav className="p-4">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="flex items-center px-4 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3 text-gray-500 dark:text-gray-400">
                            {/* Icon placeholder */}
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          </span>
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
              {/* Dashboard content */}
              {dashboardLayout.map((widgetType, index) =>
                renderWidget(widgetType, index)
              )}
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

// Export the component wrapped in NotificationProvider and Redux Provider
export default function DashboardWithProvider() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationProvider>
          <Dashboard />
        </NotificationProvider>
      </PersistGate>
    </Provider>
  );
}
