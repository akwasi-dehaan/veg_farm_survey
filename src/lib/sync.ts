import { Survey } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

export async function syncSurveys(surveys: Survey[]): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    syncedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    console.log("Syncing surveys via API...");

    const response = await fetch(`${API_BASE_URL}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveys),
    });

    if (!response.ok) {
      const errorData = await response.json();
      result.success = false;
      result.errors = errorData.errors || ["Sync request failed"];
      return result;
    }

    const syncData = await response.json();
    result.syncedCount = syncData.syncedCount;
    result.failedCount = syncData.failedCount;
    result.errors = syncData.errors || [];
    result.success = syncData.success;

    console.log(
      `Sync completed: ${result.syncedCount} synced, ${result.failedCount} failed`
    );
  } catch (error) {
    result.success = false;
    result.errors.push(
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  return result;
}

export async function checkConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/sync`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.available;
    }

    return false;
  } catch {
    return false;
  }
}
