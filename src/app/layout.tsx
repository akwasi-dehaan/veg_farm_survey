import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
