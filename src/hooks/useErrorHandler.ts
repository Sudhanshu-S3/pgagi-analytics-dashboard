import { useDispatch } from "react-redux";
import { setError as setWeatherError } from "../store/slices/weatherSlice";
import { setError as setNewsError } from "../store/slices/newsSlice";
import { setError as setDashboardError } from "../store/slices/dashboardSlice";

type ModuleType = "weather" | "news" | "dashboard";

interface ErrorHandlerOptions {
  silent?: boolean;
  reportToAnalytics?: boolean;
}

const useErrorHandler = () => {
  const dispatch = useDispatch();

  /**
   * Handles errors consistently across the application
   * @param error The error object or message
   * @param module The module where the error occurred
   * @param options Additional options for error handling
   */
  const handleError = (
    error: Error | string,
    module: ModuleType,
    options: ErrorHandlerOptions = { silent: false, reportToAnalytics: true }
  ) => {
    // Extract the error message
    const errorMessage = typeof error === "string" ? error : error.message;

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${module.toUpperCase()}] Error:`, error);
    }

    // Report to analytics if needed
    if (options.reportToAnalytics) {
      // Implement analytics reporting here
      // Example: analyticsService.reportError(module, errorMessage);
    }

    // Dispatch to store if not silent
    if (!options.silent) {
      switch (module) {
        case "weather":
          dispatch(setWeatherError(errorMessage));
          break;
        case "news":
          dispatch(setNewsError(errorMessage));
          break;
        case "dashboard":
          dispatch(setDashboardError(errorMessage));
          break;
      }
    }

    return errorMessage;
  };

  /**
   * Creates a try/catch wrapper for async functions
   * @param fn The async function to wrap
   * @param module The module where the function is used
   * @param options Additional options for error handling
   */
  const createSafeAsyncFunction = <T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    module: ModuleType,
    options: ErrorHandlerOptions = {}
  ) => {
    return async (...args: Args): Promise<T | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error(String(error)),
          module,
          options
        );
        return null;
      }
    };
  };

  return {
    handleError,
    createSafeAsyncFunction,
  };
};

export default useErrorHandler;
