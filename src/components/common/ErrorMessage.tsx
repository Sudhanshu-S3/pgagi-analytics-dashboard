import React from "react";

type ErrorSeverity = "error" | "warning" | "info";

interface ErrorMessageProps {
  message: string;
  severity?: ErrorSeverity;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  severity = "error",
  onRetry,
  className = "",
}) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case "error":
        return {
          container:
            "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-400",
          message: "text-red-600 dark:text-red-300",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          container:
            "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-400",
          message: "text-yellow-600 dark:text-yellow-300",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "info":
        return {
          container:
            "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-400",
          message: "text-blue-600 dark:text-blue-300",
          button: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border ${styles.container} ${className}`}
    >
      <div className={`font-medium mb-2 ${styles.text}`}>
        {severity === "error" && "Error"}
        {severity === "warning" && "Warning"}
        {severity === "info" && "Information"}
      </div>
      <p className={`mb-4 text-sm ${styles.message}`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`px-4 py-2 ${styles.button} text-white rounded-md shadow-sm transition-colors`}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
