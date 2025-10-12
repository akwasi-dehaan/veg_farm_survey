import React, { useState } from "react";
import { Survey } from "../../lib/types";

// Custom SVG Icons
const DownloadIcon = ({ className }: { className?: string }) => (
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
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const BarChart3Icon = ({ className }: { className?: string }) => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const DatabaseIcon = ({ className }: { className?: string }) => (
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
      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    />
  </svg>
);

interface AnalyticsData {
  totalSurveys: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  cultivationStatus: {
    yes: number;
    no: number;
  };
  averageHouseholdSize: number;
  averageDependents: number;
  averageFarmSize: number;
  averageYearsCultivating: number;
}

interface ExportAnalyticsProps {
  surveys: Survey[];
  analyticsData: AnalyticsData;
}

export const ExportAnalytics: React.FC<ExportAnalyticsProps> = ({
  surveys,
  analyticsData,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);

    // Prepare survey data for CSV
    const csvData = surveys.map((survey) => ({
      "Survey ID": survey.surveyId,
      "Respondent Name": survey.respondentName,
      Enumerator: survey.enumeratorName,
      Age: survey.age,
      Gender: survey.sex,
      "Household Size": survey.householdSize,
      "Dependents Under 18": survey.dependentsUnder18,
      "Farm Location": survey.farmLocation || survey.location,
      "Area Under Cultivation": survey.areaUnderCultivation,
      "Cultivates Vegetables": survey.cultivatesVegetables,
      "Years of Cultivation": survey.yearsOfCultivation,
      Vegetables: Object.keys(survey.vegetables || {})
        .filter((v) => survey.vegetables[v]?.selected)
        .join(", "),
      "Farming Practices": survey.farmingPractice?.join(", ") || "",
      "Seed Sources": survey.seedSource?.join(", ") || "",
      "Monthly Income": survey.monthlyIncome || "",
      "Selling Method": survey.sellingMethod || "",
      "Has Regular Buyer": survey.hasRegularBuyer || "",
      "Belongs to Group": survey.belongsToGroup || "",
      "Group Name": survey.groupName || "",
      "Group Role": survey.groupRole || "",
      "Farm Management": survey.farmManagementPractices || "",
      Challenges: Object.keys(survey.challenges || {})
        .filter((c) => survey.challenges[c]?.selected)
        .join(", "),
      "Most Important Challenge": survey.mostImportantChallenge || "",
      "Strategies Used": survey.strategies || "",
      "Strategy Success": survey.strategiesSuccessful || "",
      "Plans to Continue": survey.plansToContinue || "",
      "Training Topics": survey.trainingTopics || "",
      "Support Needed": survey.supportNeeded1 || "",
      "Encourage Expansion": survey.encourageExpansion1 || "",
      "Additional Comments": survey.additionalComments || "",
      "Enumerator Comments": survey.enumeratorComments || "",
      Timestamp: new Date(survey.timestamp).toLocaleString(),
      "Sync Status": survey.syncStatus || "unknown",
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            return typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `youth-farming-survey-data-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    setIsExporting(false);
  };

  const exportAnalyticsReport = () => {
    setIsExporting(true);

    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalSurveys: analyticsData.totalSurveys,
        averageAge: analyticsData.averageAge,
        genderDistribution: analyticsData.genderDistribution,
        cultivationStatus: analyticsData.cultivationStatus,
        averageHouseholdSize: analyticsData.averageHouseholdSize,
        averageDependents: analyticsData.averageDependents,
        averageFarmSize: analyticsData.averageFarmSize,
        averageYearsCultivating: analyticsData.averageYearsCultivating,
      },
      detailedAnalysis: {
        demographics: {
          ageGroups: {
            "18-25": surveys.filter((s) => s.age >= 18 && s.age <= 25).length,
            "26-35": surveys.filter((s) => s.age >= 26 && s.age <= 35).length,
            "36-45": surveys.filter((s) => s.age >= 36 && s.age <= 45).length,
            "46-55": surveys.filter((s) => s.age >= 46 && s.age <= 55).length,
            "55+": surveys.filter((s) => s.age > 55).length,
          },
          householdSizes: {
            "1-2": surveys.filter(
              (s) => s.householdSize >= 1 && s.householdSize <= 2
            ).length,
            "3-4": surveys.filter(
              (s) => s.householdSize >= 3 && s.householdSize <= 4
            ).length,
            "5-6": surveys.filter(
              (s) => s.householdSize >= 5 && s.householdSize <= 6
            ).length,
            "7+": surveys.filter((s) => s.householdSize >= 7).length,
          },
        },
        farmingPractices: {
          vegetableTypes: Object.keys(
            surveys.reduce((acc, s) => {
              if (s.vegetables) {
                Object.keys(s.vegetables).forEach((v) => {
                  if (s.vegetables[v]?.selected) acc[v] = (acc[v] || 0) + 1;
                });
              }
              return acc;
            }, {} as Record<string, number>)
          ),
          farmingMethods: Object.keys(
            surveys.reduce((acc, s) => {
              if (s.farmingPractice && Array.isArray(s.farmingPractice)) {
                s.farmingPractice.forEach((p) => (acc[p] = (acc[p] || 0) + 1));
              }
              return acc;
            }, {} as Record<string, number>)
          ),
          seedSources: Object.keys(
            surveys.reduce((acc, s) => {
              if (s.seedSource && Array.isArray(s.seedSource)) {
                s.seedSource.forEach(
                  (source) => (acc[source] = (acc[source] || 0) + 1)
                );
              }
              return acc;
            }, {} as Record<string, number>)
          ),
        },
        challenges: Object.keys(
          surveys.reduce((acc, s) => {
            if (s.challenges) {
              Object.keys(s.challenges).forEach((c) => {
                if (s.challenges[c]?.selected) acc[c] = (acc[c] || 0) + 1;
              });
            }
            return acc;
          }, {} as Record<string, number>)
        ),
        locations: Object.keys(
          surveys.reduce((acc, s) => {
            const location = s.farmLocation || s.location || "Unknown";
            acc[location] = (acc[location] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ),
      },
    };

    // Download JSON report
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `youth-farming-analytics-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    setIsExporting(false);
  };

  const exportChartsData = () => {
    setIsExporting(true);

    // Prepare data for external charting tools
    const chartsData = {
      demographics: {
        gender: [
          { category: "Male", value: analyticsData.genderDistribution.male },
          {
            category: "Female",
            value: analyticsData.genderDistribution.female,
          },
          { category: "Other", value: analyticsData.genderDistribution.other },
        ],
        ageGroups: [
          {
            range: "18-25",
            count: surveys.filter((s) => s.age >= 18 && s.age <= 25).length,
          },
          {
            range: "26-35",
            count: surveys.filter((s) => s.age >= 26 && s.age <= 35).length,
          },
          {
            range: "36-45",
            count: surveys.filter((s) => s.age >= 36 && s.age <= 45).length,
          },
          {
            range: "46-55",
            count: surveys.filter((s) => s.age >= 46 && s.age <= 55).length,
          },
          { range: "55+", count: surveys.filter((s) => s.age > 55).length },
        ],
      },
      farming: {
        cultivation: [
          { status: "Cultivating", count: analyticsData.cultivationStatus.yes },
          {
            status: "Not Cultivating",
            count: analyticsData.cultivationStatus.no,
          },
        ],
        vegetables: Object.entries(
          surveys.reduce((acc, s) => {
            if (s.vegetables) {
              Object.keys(s.vegetables).forEach((v) => {
                if (s.vegetables[v]?.selected) acc[v] = (acc[v] || 0) + 1;
              });
            }
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, value })),
      },
      challenges: Object.entries(
        surveys.reduce((acc, s) => {
          if (s.challenges) {
            Object.keys(s.challenges).forEach((c) => {
              if (s.challenges[c]?.selected) acc[c] = (acc[c] || 0) + 1;
            });
          }
          return acc;
        }, {} as Record<string, number>)
      ).map(([challenge, frequency]) => ({
        challenge,
        frequency,
        percentage: surveys.length > 0 ? (frequency / surveys.length) * 100 : 0,
      })),
    };

    // Download charts data
    const blob = new Blob([JSON.stringify(chartsData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `youth-farming-charts-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    setIsExporting(false);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={exportToCSV}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <DownloadIcon className="h-4 w-4 mr-2" />
        {isExporting ? "Exporting..." : "Export CSV"}
      </button>

      <button
        onClick={exportAnalyticsReport}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <FileTextIcon className="h-4 w-4 mr-2" />
        {isExporting ? "Exporting..." : "Analytics Report"}
      </button>

      <button
        onClick={exportChartsData}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <BarChart3Icon className="h-4 w-4 mr-2" />
        {isExporting ? "Exporting..." : "Charts Data"}
      </button>
    </div>
  );
};
