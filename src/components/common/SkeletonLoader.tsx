import React from "react";

interface SkeletonLoaderProps {
  type: "card" | "list" | "chart" | "text" | "table";
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type,
  count = 1,
  height,
  width,
  className = "",
}) => {
  const getSkeletonByType = () => {
    switch (type) {
      case "card":
        return (
          <div
            className={`rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ${
              height ? height : "h-40"
            } ${width ? width : "w-full"} ${className}`}
          />
        );
      case "chart":
        return (
          <div
            className={`rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ${
              height ? height : "h-64"
            } ${width ? width : "w-full"} ${className}`}
          />
        );
      case "list":
        return Array(count)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="flex space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          ));
      case "text":
        return Array(count)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 ${
                width ? width : "w-full"
              } ${className}`}
            />
          ));
      case "table":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
            </div>
            {Array(count)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, cellIdx) => (
                      <div
                        key={cellIdx}
                        className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                      ></div>
                    ))}
                </div>
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <>{getSkeletonByType()}</>;
};

export default SkeletonLoader;
