// app/layout.tsx (Server Component)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/app-layout";
import { ModuleProvider } from "./context/ModuleContext";
import { AppProvider } from "@/contexts/app-context";
import ClientToaster from "@/components/client-toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cubicle CRM",
  description: "A comprehensive business management platform",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",        // standard favicon
    shortcut: "/favicon.ico",    // optional shortcut icon
    apple: "/apple-touch-icon.png", // iOS icon (place in public folder)
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ModuleProvider>
            <AppProvider>

              {children}
            </AppProvider>
          </ModuleProvider>

          {/* ✅ Persistent toast container */}
          <ClientToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
