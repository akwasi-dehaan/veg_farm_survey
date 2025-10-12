import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Survey, CHALLENGE_OPTIONS } from "../../lib/types";

interface ChallengesAnalysisProps {
  surveys: Survey[];
}

export const ChallengesAnalysis: React.FC<ChallengesAnalysisProps> = ({
  surveys,
}) => {
  // Calculate challenge frequency and average severity
  const challengeAnalysis = CHALLENGE_OPTIONS.map((challenge) => {
    const surveysWithChallenge = surveys.filter(
      (survey) =>
        survey.challenges && survey.challenges[challenge.value]?.selected
    );

    const totalSurveys = surveysWithChallenge.length;
    const averageSeverity =
      totalSurveys > 0
        ? surveysWithChallenge.reduce(
            (sum, survey) =>
              sum + (survey.challenges[challenge.value]?.severity || 0),
            0
          ) / totalSurveys
        : 0;

    return {
      challenge: challenge.label,
      frequency: totalSurveys,
      percentage:
        surveys.length > 0 ? (totalSurveys / surveys.length) * 100 : 0,
      averageSeverity: averageSeverity,
      severityScore: totalSurveys * averageSeverity, // Combined impact score
    };
  }).sort((a, b) => b.severityScore - a.severityScore);

  // Top challenges by frequency
  const topChallenges = challengeAnalysis.slice(0, 10);

  // Severity analysis for radar chart
  const severityData = challengeAnalysis.slice(0, 8).map((item) => ({
    challenge: item.challenge,
    frequency: item.percentage,
    severity: item.averageSeverity * 20, // Scale for radar chart
    impact: item.severityScore,
  }));

  // Challenge categories analysis
  const categoryAnalysis = {
    "Input Related": challengeAnalysis
      .filter((c) =>
        [
          "Lack of quality seed",
          "High cost of inputs (fertilizer, pesticides)",
          "Lack of credit/finance",
        ].includes(c.challenge)
      )
      .reduce((sum, c) => sum + c.frequency, 0),
    "Production Related": challengeAnalysis
      .filter((c) =>
        [
          "Pest and disease problems",
          "Water shortage/irrigation issues",
          "Weather/climate variability",
        ].includes(c.challenge)
      )
      .reduce((sum, c) => sum + c.frequency, 0),
    "Market Related": challengeAnalysis
      .filter((c) =>
        [
          "Lack of access to markets / low prices",
          "Lack of transport or high transport cost",
          "Post-harvest losses",
        ].includes(c.challenge)
      )
      .reduce((sum, c) => sum + c.frequency, 0),
    "Knowledge Related": challengeAnalysis
      .filter((c) =>
        ["Lack of training/knowledge", "Gender-related constraints"].includes(
          c.challenge
        )
      )
      .reduce((sum, c) => sum + c.frequency, 0),
    "Security Related": challengeAnalysis
      .filter((c) =>
        ["Land access/tenure insecurity", "Theft/vandalism"].includes(
          c.challenge
        )
      )
      .reduce((sum, c) => sum + c.frequency, 0),
  };

  const categoryData = Object.entries(categoryAnalysis).map(
    ([category, count]) => ({
      category,
      count,
      percentage: surveys.length > 0 ? (count / surveys.length) * 100 : 0,
    })
  );

  return (
    <div className="space-y-6">
      {/* Top Challenges by Impact */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Top Challenges by Impact
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topChallenges} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="challenge" type="category" width={120} />
            <Tooltip
              formatter={(value, name) => [
                name === "frequency"
                  ? `${value} surveys`
                  : name === "percentage"
                  ? `${Number(value).toFixed(1)}%`
                  : name === "averageSeverity"
                  ? `${Number(value).toFixed(1)}/5`
                  : value,
                name === "frequency"
                  ? "Frequency"
                  : name === "percentage"
                  ? "Percentage"
                  : name === "averageSeverity"
                  ? "Avg Severity"
                  : name,
              ]}
            />
            <Bar dataKey="frequency" fill="#EF4444" name="frequency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Challenge Categories */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Challenge Categories
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "count"
                  ? `${value} surveys`
                  : `${Number(value).toFixed(1)}%`,
                name === "count" ? "Count" : "Percentage",
              ]}
            />
            <Bar dataKey="count" fill="#3B82F6" name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Analysis */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Challenge Severity Analysis
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={severityData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="challenge" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Frequency %"
              dataKey="frequency"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
            <Radar
              name="Severity Score"
              dataKey="severity"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h5 className="font-medium text-red-800">Most Common Challenge</h5>
          <p className="text-sm text-red-600">
            {topChallenges[0]?.challenge || "N/A"}(
            {topChallenges[0]?.percentage.toFixed(1)}%)
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h5 className="font-medium text-orange-800">Highest Severity</h5>
          <p className="text-sm text-orange-600">
            {challengeAnalysis.sort(
              (a, b) => b.averageSeverity - a.averageSeverity
            )[0]?.challenge || "N/A"}
            (
            {challengeAnalysis
              .sort((a, b) => b.averageSeverity - a.averageSeverity)[0]
              ?.averageSeverity.toFixed(1)}
            /5)
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-800">Total Challenge Reports</h5>
          <p className="text-sm text-blue-600">
            {challengeAnalysis.reduce((sum, c) => sum + c.frequency, 0)}{" "}
            instances
          </p>
        </div>
      </div>
    </div>
  );
};
