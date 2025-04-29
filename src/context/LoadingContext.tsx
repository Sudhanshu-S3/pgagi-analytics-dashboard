import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: isLoading }));
  };

  const isLoading = (key: string) => {
    return !!loadingStates[key];
  };

  const clearLoading = (key: string) => {
    setLoadingStates((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const clearAllLoading = () => {
    setLoadingStates({});
  };

  return (
    <LoadingContext.Provider
      value={{
        loadingStates,
        setLoading,
        isLoading,
        clearLoading,
        clearAllLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
