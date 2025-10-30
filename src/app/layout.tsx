import type { Metadata } from "next";
import "./globals.css";
import { GlobalSyncProvider } from "@/components/GlobalSyncProvider";

export const metadata: Metadata = {
  title: "Youth Vegetable Farming Survey",
  description:
    "A comprehensive survey to understand youth engagement in vegetable farming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalSyncProvider>{children}</GlobalSyncProvider>
      </body>
    </html>
  );
}
