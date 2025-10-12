import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { syncSurveys, SyncResult } from "../../lib/sync";
import { getSurveyCounts } from "../../lib/db";
import { Survey } from "../../lib/types";

// Custom SVG Icons
const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface SyncButtonProps {
  surveys: Survey[];
  onSyncComplete?: (result: SyncResult) => void;
  className?: string;
}

export const SyncButton: React.FC<SyncButtonProps> = ({
  surveys,
  onSyncComplete,
  className = "",
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const { isOnline } = useOnlineStatus();

  const updatePendingCount = async () => {
    try {
      const counts = await getSurveyCounts();
      setPendingCount(counts.pending);
    } catch (error) {
      console.error("Error getting pending count:", error);
    }
  };

  useEffect(() => {
    updatePendingCount();
  }, []);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await syncSurveys(surveys);
      setLastSyncResult(result);
      await updatePendingCount();
      onSyncComplete?.(result);
    } catch (error) {
      console.error("Sync failed:", error);
      setLastSyncResult({
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: [
          "Sync failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        ],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getButtonText = () => {
    if (isSyncing) return "Syncing...";
    if (pendingCount === 0) return "No pending surveys";
    return `Sync ${pendingCount} survey${pendingCount === 1 ? "" : "s"}`;
  };

  const getButtonVariant = () => {
    if (lastSyncResult?.success) return "primary";
    if (lastSyncResult && !lastSyncResult.success) return "danger";
    return "primary";
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        onClick={handleSync}
        disabled={!isOnline || isSyncing || pendingCount === 0}
        loading={isSyncing}
        variant={getButtonVariant()}
        size="sm"
      >
        <RefreshCwIcon
          className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
        />
        {getButtonText()}
      </Button>

      {lastSyncResult && (
        <div className="flex items-center space-x-1 text-sm">
          {lastSyncResult.success ? (
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          ) : (
            <XCircleIcon className="h-4 w-4 text-red-500" />
          )}
          <span
            className={
              lastSyncResult.success ? "text-green-600" : "text-red-600"
            }
          >
            {lastSyncResult.syncedCount} synced, {lastSyncResult.failedCount}{" "}
            failed
          </span>
        </div>
      )}
    </div>
  );
};
