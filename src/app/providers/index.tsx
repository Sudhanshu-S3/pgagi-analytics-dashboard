"use client";

import { NotificationProvider } from "@/components/Notification";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class">
            <NotificationProvider>{children}</NotificationProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </PersistGate>
    </Provider>
  );
}
