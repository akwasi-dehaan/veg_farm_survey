"use client";

import { useEffect, useRef } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { getAllSurveys } from "@/lib/db";
import { syncSurveys } from "@/lib/sync";

class GlobalSyncService {
  private intervalId: NodeJS.Timeout | null = null;
  private isOnline: boolean = false;
  private isRunning: boolean = false;

  constructor() {
    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.startPeriodicSync();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
        this.stopPeriodicSync();
      });

      // Initialize online status
      this.isOnline = navigator.onLine;
    }
  }

  public setOnlineStatus(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.startPeriodicSync();
    } else {
      this.stopPeriodicSync();
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private async performSync() {
    if (!this.isOnline || this.isRunning) return;

    try {
      this.isRunning = true;
      console.log("🔄 Global auto-sync: Checking for pending surveys...");

      const surveys = await getAllSurveys();
      const pendingSurveys = surveys.filter((s) => s.syncStatus === "pending");

      if (pendingSurveys.length === 0) {
        console.log("✅ Global auto-sync: No pending surveys to sync");
        return;
      }

      console.log(
        `🔄 Global auto-sync: Syncing ${pendingSurveys.length} surveys...`
      );
      const result = await syncSurveys(pendingSurveys);

      if (result.success) {
        console.log(
          `✅ Global auto-sync: ${result.syncedCount} surveys synced successfully`
        );
        // Dispatch event to notify other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("globalSyncComplete", {
              detail: {
                syncedCount: result.syncedCount,
                failedCount: result.failedCount,
              },
            })
          );
        }
      } else {
        console.log(
          `❌ Global auto-sync: ${result.failedCount} surveys failed to sync`
        );
      }
    } catch (error) {
      console.error("❌ Global auto-sync error:", error);
    } finally {
      this.isRunning = false;
    }
  }

  private startPeriodicSync() {
    if (this.intervalId) return; // Already running

    // Immediate sync when coming online
    setTimeout(() => {
      this.performSync();
    }, 2000); // 2-second delay

    // Periodic sync every 1 minute
    this.intervalId = setInterval(() => {
      this.performSync();
    }, 1 * 60 * 1000); // 1 minute

    console.log("🔄 Global auto-sync: Started periodic sync");
  }

  private stopPeriodicSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("⏹️ Global auto-sync: Stopped periodic sync");
    }
  }

  public destroy() {
    this.stopPeriodicSync();
  }
}

// Global instance
let globalSyncService: GlobalSyncService | null = null;

export const getGlobalSyncService = (): GlobalSyncService => {
  if (!globalSyncService) {
    globalSyncService = new GlobalSyncService();
  }
  return globalSyncService;
};

// React hook for global sync
export const useGlobalSync = () => {
  const { isOnline } = useOnlineStatus();
  const serviceRef = useRef<GlobalSyncService | null>(null);

  useEffect(() => {
    // Initialize service
    if (!serviceRef.current) {
      serviceRef.current = getGlobalSyncService();
    }

    // Update online status
    serviceRef.current.setOnlineStatus(isOnline);

    // Cleanup on unmount
    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy();
        serviceRef.current = null;
      }
    };
  }, [isOnline]);

  return {
    isOnline,
    isRunning: serviceRef.current?.getIsRunning() || false,
  };
};
