import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";

// Types
export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, "id">) => void;
  removeNotification: (id: string) => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Actions
type Action =
  | { type: "ADD_NOTIFICATION"; payload: NotificationItem }
  | { type: "REMOVE_NOTIFICATION"; payload: { id: string } };

// Reducer
const notificationReducer = (
  state: NotificationItem[],
  action: Action
): NotificationItem[] => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [...state, action.payload];
    case "REMOVE_NOTIFICATION":
      return state.filter(
        (notification) => notification.id !== action.payload.id
      );
    default:
      return state;
  }
};

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = useCallback(
    (notification: Omit<NotificationItem, "id">) => {
      const id = nanoid();
      const newNotification: NotificationItem = {
        id,
        ...notification,
      };

      dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });

      // Auto remove notification after specified duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_NOTIFICATION", payload: { id } });
        }, notification.duration || 5000);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: { id } });
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Hook to use the notification context
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Notification Container Component
const NotificationContainer: React.FC<{
  notifications: NotificationItem[];
  removeNotification: (id: string) => void;
}> = ({ notifications, removeNotification }) => {
  return (
    <div
      className="fixed z-50 top-0 right-0 p-4 space-y-4 w-full max-w-sm"
      aria-live="assertive"
      role="alert"
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg shadow-lg overflow-hidden border ${
              notification.type === "success"
                ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-600"
                : notification.type === "error"
                ? "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-600"
                : notification.type === "warning"
                ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-600"
                : "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-600"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === "success" && (
                    <svg
                      className="h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {notification.type === "error" && (
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {notification.type === "warning" && (
                    <svg
                      className="h-5 w-5 text-yellow-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {notification.type === "info" && (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-transparent rounded-md inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProvider;
