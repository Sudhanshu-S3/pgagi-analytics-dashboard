import "@/app/globals.css";
import { ReactNode } from "react";
import { Providers } from "./provider";
import { QueryProvider } from "./queryProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/persistor";

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
