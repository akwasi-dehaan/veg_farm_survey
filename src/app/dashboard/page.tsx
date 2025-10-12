"use client";

import React, { useState, useEffect } from "react";
import { SyncButton } from "../../components/shared/SyncButton";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { syncSurveys } from "@/lib/sync";
import { SurveyTable } from "../../components/dashboard/SurveyTable";
import { SurveyDetail } from "../../components/dashboard/SurveyDetail";
import { AnalyticsDashboard } from "../../components/analytics/AnalyticsDashboard";
import { Notification } from "../../components/ui/Notification";
import { Button } from "../../components/ui/Button";
// Custom SVG Icons
const PlusIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const RefreshCwIcon = () => (
  <svg
    className="h-4 w-4"
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

const BarChartIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const TableIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
    />
  </svg>
);
import { Survey, NotificationState } from "@/lib/types";
import { getAllSurveys, deleteSurvey, getSurveyCounts } from "@/lib/db";
import { exportSurveys } from "@/lib/export";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [currentView, setCurrentView] = useState<"table" | "analytics">(
    "table"
  );
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    synced: 0,
    failed: 0,
  });

  const router = useRouter();
  const isOnline = useOnlineStatus();

  // Fetch surveys from server (MySQL)
  const fetchServerSurveys = async (): Promise<Survey[]> => {
    try {
      const response = await fetch("/api/surveys");
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      return data.surveys || [];
    } catch (error) {
      console.error("Error fetching server surveys:", error);
      return [];
    }
  };

  // Merge surveys from local and server sources
  const mergeSurveys = (
    localSurveys: Survey[],
    serverSurveys: Survey[]
  ): Survey[] => {
    const surveyMap = new Map<string, Survey>();

    // Add local surveys first
    localSurveys.forEach((survey) => {
      surveyMap.set(survey.surveyId, { ...survey, syncStatus: "pending" });
    });

    // Add/update with server surveys (server data takes precedence)
    serverSurveys.forEach((survey) => {
      surveyMap.set(survey.surveyId, { ...survey, syncStatus: "synced" });
    });

    return Array.from(surveyMap.values());
  };

  // Calculate survey counts from combined data
  const calculateSurveyCounts = (surveys: Survey[]) => {
    return {
      total: surveys.length,
      pending: surveys.filter((s) => s.syncStatus === "pending").length,
      synced: surveys.filter((s) => s.syncStatus === "synced").length,
      failed: surveys.filter((s) => s.syncStatus === "failed").length,
    };
  };

  const loadSurveys = async () => {
    try {
      setLoading(true);

      // Fetch from both local storage (IndexedDB) and server (MySQL)
      const [localSurveys, serverSurveys] = await Promise.allSettled([
        getAllSurveys(), // Local IndexedDB
        fetchServerSurveys(), // Server MySQL
      ]);

      // Track data source availability
      const localAvailable = localSurveys.status === "fulfilled";
      const serverAvailable = serverSurveys.status === "fulfilled";

      // Combine surveys from both sources
      const localData = localAvailable ? localSurveys.value : [];
      const serverData = serverAvailable ? serverSurveys.value : [];

      // Merge surveys, prioritizing server data for duplicates
      const combinedSurveys = mergeSurveys(localData, serverData);
      setSurveys(combinedSurveys);

      // Calculate counts from combined data
      const surveyCounts = calculateSurveyCounts(combinedSurveys);
      setCounts(surveyCounts);

      // Log any errors from individual sources
      if (!localAvailable) {
        console.error("Error loading local surveys:", localSurveys.reason);
      }
      if (!serverAvailable) {
        console.error("Error loading server surveys:", serverSurveys.reason);
      }

      // Show notification if only one source is available
      if (localAvailable && !serverAvailable) {
        setNotification({
          show: true,
          type: "warning",
          message: "Showing local data only. Server connection unavailable.",
        });
      } else if (!localAvailable && serverAvailable) {
        setNotification({
          show: true,
          type: "warning",
          message: "Showing server data only. Local storage unavailable.",
        });
      } else if (!localAvailable && !serverAvailable) {
        setNotification({
          show: true,
          type: "error",
          message: "Unable to load data from any source.",
        });
      }
    } catch (error) {
      console.error("Error loading surveys:", error);

      // Check if it's a database version error
      if (error instanceof Error && error.message.includes("version")) {
        setNotification({
          show: true,
          type: "error",
          message:
            "Database version conflict. Please clear your browser data or use the clear tool.",
        });
      } else {
        setNotification({
          show: true,
          type: "error",
          message: "Failed to load surveys",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Automatic sync when online
  const autoSync = async () => {
    if (!isOnline) return;

    const pendingSurveys = surveys.filter((s) => s.syncStatus === "pending");
    if (pendingSurveys.length === 0) return;

    try {
      console.log(`Auto-syncing ${pendingSurveys.length} surveys...`);
      const result = await syncSurveys(pendingSurveys);

      if (result.success) {
        console.log(
          `Auto-sync completed: ${result.syncedCount} surveys synced`
        );
        // Refresh data after successful sync
        loadSurveys();
      } else {
        console.log(`Auto-sync failed: ${result.failedCount} surveys failed`);
      }
    } catch (error) {
      console.error("Auto-sync error:", error);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  // Auto-sync when coming online or when surveys change
  useEffect(() => {
    if (isOnline && surveys.length > 0) {
      const pendingCount = surveys.filter(
        (s) => s.syncStatus === "pending"
      ).length;
      if (pendingCount > 0) {
        // Delay auto-sync to avoid conflicts with initial load
        const timer = setTimeout(() => {
          autoSync();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, surveys.length]);

  // Periodic auto-sync when online (every 5 minutes)
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      const pendingSurveys = surveys.filter((s) => s.syncStatus === "pending");
      if (pendingSurveys.length > 0) {
        console.log(
          `Periodic auto-sync: ${pendingSurveys.length} surveys pending`
        );
        autoSync();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isOnline, surveys]);

  const handleViewSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this survey? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteSurvey(surveyId);
      await loadSurveys();
      setNotification({
        show: true,
        type: "success",
        message: "Survey deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting survey:", error);
      setNotification({
        show: true,
        type: "error",
        message: "Failed to delete survey",
      });
    }
  };

  const handleExportSurveys = (surveysToExport: Survey[]) => {
    try {
      exportSurveys(surveysToExport, "json");
      setNotification({
        show: true,
        type: "success",
        message: `Exported ${surveysToExport.length} surveys`,
      });
    } catch (error) {
      console.error("Error exporting surveys:", error);
      setNotification({
        show: true,
        type: "error",
        message: "Failed to export surveys",
      });
    }
  };

  const handleSyncComplete = (result: {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
  }) => {
    if (result.success) {
      setNotification({
        show: true,
        type: "success",
        message: `Sync completed: ${result.syncedCount} surveys synced`,
      });
    } else {
      setNotification({
        show: true,
        type: "error",
        message: `Sync failed: ${result.failedCount} surveys failed`,
      });
    }
    loadSurveys(); // Refresh the data
  };

  const handleNewSurvey = () => {
    router.push("/survey");
  };

  const handleExportCSV = () => {
    try {
      exportSurveys(surveys, "csv");
      setNotification({
        show: true,
        type: "success",
        message: `Exported ${surveys.length} surveys as CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setNotification({
        show: true,
        type: "error",
        message: "Failed to export CSV",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Survey Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view collected survey data
              </p>
            </div>

            {/* Online Status & Auto-Sync Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {isOnline &&
                surveys.filter((s) => s.syncStatus === "pending").length >
                  0 && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Auto-sync enabled</span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Surveys
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counts.total}
                </p>
                <p className="text-xs text-gray-400 mt-1">All collected data</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Sync
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counts.pending}
                </p>
                <p className="text-xs text-gray-400 mt-1">Awaiting upload</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Synced</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counts.synced}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Successfully uploaded
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {counts.failed}
                </p>
                <p className="text-xs text-gray-400 mt-1">Need attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {surveys.length > 0
                  ? Math.round(
                      surveys.reduce((sum, s) => sum + s.age, 0) /
                        surveys.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Average Age</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {surveys.filter((s) => s.sex === "female").length}
              </div>
              <div className="text-sm text-gray-600">Female Respondents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {surveys.filter((s) => s.cultivatesVegetables === "yes").length}
              </div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView("table")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "table"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TableIcon />
                  <span className="ml-2">Data Table</span>
                </button>
                <button
                  onClick={() => setCurrentView("analytics")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "analytics"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BarChartIcon />
                  <span className="ml-2">Analytics</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={handleNewSurvey} variant="primary">
                <PlusIcon />
                <span className="ml-2">New Survey</span>
              </Button>

              <Button onClick={handleExportCSV} variant="outline">
                <DownloadIcon />
                <span className="ml-2">Export CSV</span>
              </Button>

              <Button onClick={loadSurveys} variant="outline" loading={loading}>
                <RefreshCwIcon />
                <span className="ml-2">Refresh</span>
              </Button>

              <SyncButton
                surveys={surveys}
                onSyncComplete={handleSyncComplete}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {currentView === "table" ? (
          <SurveyTable
            surveys={surveys}
            onView={handleViewSurvey}
            onDelete={handleDeleteSurvey}
            onExport={handleExportSurveys}
            loading={loading}
          />
        ) : (
          <AnalyticsDashboard surveys={surveys} />
        )}
      </div>

      {/* Survey Detail Modal */}
      {selectedSurvey && (
        <SurveyDetail
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
        />
      )}

      {/* Notification */}
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() =>
          setNotification((prev: NotificationState) => ({
            ...prev,
            show: false,
          }))
        }
      />
    </div>
  );
}
