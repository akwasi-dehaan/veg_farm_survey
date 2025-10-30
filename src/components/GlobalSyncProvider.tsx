"use client";

import React from "react";
import { useGlobalSync } from "@/lib/global-sync";

interface GlobalSyncProviderProps {
  children: React.ReactNode;
}

export const GlobalSyncProvider: React.FC<GlobalSyncProviderProps> = ({
  children,
}) => {
  const { isOnline } = useGlobalSync();

  return (
    <>
      {children}
      {/* Global sync status indicator - only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 9999,
            backgroundColor: isOnline ? "#10b981" : "#ef4444",
            color: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {isOnline
            ? "🟢 Online - Auto-sync active"
            : "🔴 Offline - Auto-sync paused"}
        </div>
      )}
    </>
  );
};
