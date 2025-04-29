"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { NotificationProvider } from "@/components/Notification";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeProvider>
  );
}
