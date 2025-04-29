import React from "react";
import SkeletonLoader from "./SkeletonLoader";

interface WithLoadingProps {
  isLoading: boolean;
  error: string | null;
  loaderType:
    | "card"
    | "list"
    | "chart"
    | "text"
    | "table"
    | "avatar"
    | "button"
    | "form"
    | "stats";
  count?: number;
  onRetry?: () => void;
  loaderProps?: Record<string, any>;
}

const withLoading = <P extends object>(Component: React.ComponentType<P>) => {
  return ({
    isLoading,
    error,
    loaderType,
    count = 1,
    onRetry,
    loaderProps = {},
    ...props
  }: P & WithLoadingProps) => {
    if (isLoading) {
      return (
        <SkeletonLoader type={loaderType} count={count} {...loaderProps} />
      );
    }

    if (error) {
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="text-red-700 dark:text-red-400 font-medium mb-2">
            Error Loading Data
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md shadow-sm transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    return <Component {...(props as P)} />;
  };
};

export default withLoading;
