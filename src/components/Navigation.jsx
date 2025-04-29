import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navigation({ items }) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav aria-label="Main navigation" className="py-2">
      <ul className="space-y-1 px-3">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.name} className="relative">
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
                aria-current={isActive ? "page" : undefined}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span
                  className={`mr-3 ${
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {/* Icon placeholder */}
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {item.icon === "home" && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isActive ? 2.5 : 2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    )}
                    {item.icon === "cloud" && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isActive ? 2.5 : 2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    )}
                    {item.icon === "newspaper" && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isActive ? 2.5 : 2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2.5M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                    {item.icon === "chart-line" && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isActive ? 2.5 : 2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    )}
                    {item.icon === "cog" && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isActive ? 2.5 : 2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                    )}
                  </svg>
                </span>
                {item.name}

                {/* Indicator for active page */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1.5 h-5 bg-primary-500 dark:bg-primary-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>

              {/* Tooltip for hovering */}
              {hoveredItem === item.name && !isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-1/2 -left-2 transform -translate-x-full -translate-y-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded hidden lg:block z-10"
                >
                  {item.name}
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800 dark:bg-gray-700" />
                </motion.div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Bottom section with profile or settings */}
      <div className="mt-8 px-3">
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href="#settings"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                U
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Your Account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View profile
              </p>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
}
