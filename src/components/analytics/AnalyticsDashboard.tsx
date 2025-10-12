import React, { useState, useMemo } from "react";
import { Survey } from "../../lib/types";
import { OverviewStats } from "./OverviewStats";
import { DemographicsChart } from "./DemographicsChart";
import { FarmingPracticesChart } from "./FarmingPracticesChart";
import { ChallengesAnalysis } from "./ChallengesAnalysis";
import { IncomeAnalysis } from "./IncomeAnalysis";
import { GeographicAnalysis } from "./GeographicAnalysis";
import { DataFilters } from "./DataFilters";
import { ExportAnalytics } from "./ExportAnalytics";

interface AnalyticsDashboardProps {
  surveys: Survey[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  surveys,
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: { start: null as string | null, end: null as string | null },
    location: "",
    ageRange: { min: 0, max: 100 },
    gender: "",
    enumerator: "",
  });

  // Filter surveys based on selected filters
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      // Date range filter
      if (selectedFilters.dateRange.start && selectedFilters.dateRange.end) {
        const surveyDate = new Date(survey.timestamp);
        const startDate = new Date(selectedFilters.dateRange.start);
        const endDate = new Date(selectedFilters.dateRange.end);
        if (surveyDate < startDate || surveyDate > endDate) return false;
      }

      // Location filter
      if (
        selectedFilters.location &&
        !survey.farmLocation
          ?.toLowerCase()
          .includes(selectedFilters.location.toLowerCase())
      ) {
        return false;
      }

      // Age range filter
      if (
        survey.age < selectedFilters.ageRange.min ||
        survey.age > selectedFilters.ageRange.max
      ) {
        return false;
      }

      // Gender filter
      if (selectedFilters.gender && survey.sex !== selectedFilters.gender) {
        return false;
      }

      // Enumerator filter
      if (
        selectedFilters.enumerator &&
        !survey.enumeratorName
          ?.toLowerCase()
          .includes(selectedFilters.enumerator.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [surveys, selectedFilters]);

  const analyticsData = useMemo(() => {
    return {
      totalSurveys: filteredSurveys.length,
      averageAge:
        filteredSurveys.reduce((sum, s) => sum + s.age, 0) /
          filteredSurveys.length || 0,
      genderDistribution: {
        male: filteredSurveys.filter((s) => s.sex === "male").length,
        female: filteredSurveys.filter((s) => s.sex === "female").length,
        other: filteredSurveys.filter((s) => s.sex === "other").length,
      },
      cultivationStatus: {
        yes: filteredSurveys.filter((s) => s.cultivatesVegetables === "yes")
          .length,
        no: filteredSurveys.filter((s) => s.cultivatesVegetables === "no")
          .length,
      },
      averageHouseholdSize:
        filteredSurveys.reduce((sum, s) => sum + s.householdSize, 0) /
          filteredSurveys.length || 0,
      averageDependents:
        filteredSurveys.reduce((sum, s) => sum + s.dependentsUnder18, 0) /
          filteredSurveys.length || 0,
      averageFarmSize:
        filteredSurveys.reduce(
          (sum, s) => sum + parseFloat(s.areaUnderCultivation || "0"),
          0
        ) / filteredSurveys.length || 0,
      averageYearsCultivating:
        filteredSurveys.reduce((sum, s) => sum + s.yearsOfCultivation, 0) /
          filteredSurveys.length || 0,
    };
  }, [filteredSurveys]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analysis of {filteredSurveys.length} survey
              responses
            </p>
          </div>
          <ExportAnalytics
            surveys={filteredSurveys}
            analyticsData={analyticsData}
          />
        </div>
      </div>

      {/* Filters */}
      <DataFilters
        filters={selectedFilters}
        onFiltersChange={setSelectedFilters}
        totalSurveys={surveys.length}
        filteredSurveys={filteredSurveys.length}
      />

      {/* Overview Statistics */}
      <OverviewStats analyticsData={analyticsData} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Demographics
          </h3>
          <DemographicsChart surveys={filteredSurveys} />
        </div>

        {/* Farming Practices */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Farming Practices
          </h3>
          <FarmingPracticesChart surveys={filteredSurveys} />
        </div>

        {/* Challenges Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Challenges Analysis
          </h3>
          <ChallengesAnalysis surveys={filteredSurveys} />
        </div>

        {/* Income Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Income Analysis
          </h3>
          <IncomeAnalysis surveys={filteredSurveys} />
        </div>
      </div>

      {/* Geographic Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Geographic Distribution
        </h3>
        <GeographicAnalysis surveys={filteredSurveys} />
      </div>
    </div>
  );
};
