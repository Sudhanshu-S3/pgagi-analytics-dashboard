"use client";

import { NotificationProvider } from "@/components/Notification";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider };