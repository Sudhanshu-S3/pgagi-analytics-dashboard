import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Column<T extends object> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
}

interface TableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  keyExtractor: (item: T) => string | number;
}

export function Table<T extends object>({
  data,
  columns,
  pageSize = 10,
  className = "",
  onRowClick,
  keyExtractor,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      if (
        typeof a[sortColumn] === "string" &&
        typeof b[sortColumn] === "string"
      ) {
        return sortDirection === "asc"
          ? (a[sortColumn] as string).localeCompare(b[sortColumn] as string)
          : (b[sortColumn] as string).localeCompare(a[sortColumn] as string);
      }

      if (sortDirection === "asc") {
        return (a[sortColumn] as number) - (b[sortColumn] as number);
      } else {
        return (b[sortColumn] as number) - (a[sortColumn] as number);
      }
    });
  }, [data, sortColumn, sortDirection]);

  // Get current page data
  const currentData = sortedData.slice(startIndex, endIndex);

  // Handle sort toggle
  const handleSort = (column: keyof T) => {
    if (!column) return;

    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Cell render function
  const renderCell = (row: T, column: Column<T>) => {
    // Handle function accessor
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    // For property accessors, use explicit typing and check existence
    const key = column.accessor as keyof T;
    if (key in row ) {
      return row[key];
    }

    // Return a fallback value if the property doesn't exist
    return null;
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
        >
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      : ""
                  } ${column.className || ""}`}
                  onClick={() =>
                    column.sortable && handleSort(column.accessor as keyof T)
                  }
                  aria-sort={
                    sortColumn === column.accessor
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="ml-2">
                        {sortColumn === column.accessor
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : "◆"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            <AnimatePresence>
              {/* AnimatePresence needs to have its children directly nested */}
              <tr style={{ display: "contents" }}>
                {currentData.map((row) => (
                  <motion.tr
                    key={keyExtractor(row)}
                    className={`${
                      onRowClick
                        ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => onRowClick && onRowClick(row)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: onRowClick ? 1.01 : 1 }}
                  >
                    {columns.map((column, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 ${
                          column.className || ""
                        }`}
                      >
                        renderCell(row, column)
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tr>
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                ${
                  currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`relative px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                ${
                  currentPage === totalPages
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
