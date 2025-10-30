import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
} from "recharts";
import { Survey } from "../../lib/types";

interface IncomeAnalysisProps {
  surveys: Survey[];
}

export const IncomeAnalysis: React.FC<IncomeAnalysisProps> = ({ surveys }) => {
  // Parse income data (assuming format like "500 GHS" or "1000 USD")
  const parseIncome = (incomeStr: string): number => {
    if (!incomeStr) return 0;
    const match = incomeStr.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Income analysis
  const incomeData = surveys
    .filter(
      (survey) => survey.monthlyIncome && survey.monthlyIncome.trim() !== ""
    )
    .map((survey) => ({
      ...survey,
      incomeValue: parseIncome(survey.monthlyIncome || ""),
      currency:
        survey.monthlyIncome?.replace(/\d+(?:\.\d+)?\s*/, "") || "Unknown",
    }))
    .filter((survey) => survey.incomeValue > 0);

  // Income distribution by ranges
  const incomeRanges = [
    { range: "0-200", min: 0, max: 200, count: 0 },
    { range: "201-500", min: 201, max: 500, count: 0 },
    { range: "501-1000", min: 501, max: 1000, count: 0 },
    { range: "1001-2000", min: 1001, max: 2000, count: 0 },
    { range: "2000+", min: 2001, max: Infinity, count: 0 },
  ];

  incomeData.forEach((survey) => {
    const income = survey.incomeValue;
    const range = incomeRanges.find((r) => income >= r.min && income <= r.max);
    if (range) range.count++;
  });

  // Income by gender
  const incomeByGender = {
    male: incomeData.filter((s) => s.sex === "male"),
    female: incomeData.filter((s) => s.sex === "female"),
    other: incomeData.filter((s) => s.sex === "other"),
  };

  const genderIncomeStats = Object.entries(incomeByGender).map(
    ([gender, surveys]) => ({
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      averageIncome:
        surveys.length > 0
          ? surveys.reduce((sum, s) => sum + s.incomeValue, 0) / surveys.length
          : 0,
      count: surveys.length,
    })
  );

  // Income vs Farm Size correlation
  const incomeVsFarmSize = incomeData.map((survey) => ({
    farmSize: parseFloat(survey.areaUnderCultivation || "0"),
    income: survey.incomeValue,
    gender: survey.sex,
  }));

  // Income by selling method
  const sellingMethods = surveys.reduce((acc, survey) => {
    if (survey.sellingMethod) {
      acc[survey.sellingMethod] = (acc[survey.sellingMethod] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sellingMethodData = Object.entries(sellingMethods).map(
    ([method, count]) => ({
      method,
      count,
      percentage: surveys.length > 0 ? (count / surveys.length) * 100 : 0,
    })
  );

  // Calculate statistics
  const totalIncome = incomeData.reduce((sum, s) => sum + s.incomeValue, 0);
  const averageIncome =
    incomeData.length > 0 ? totalIncome / incomeData.length : 0;
  const maxIncome =
    incomeData.length > 0
      ? Math.max(...incomeData.map((s) => s.incomeValue))
      : 0;
  const minIncome =
    incomeData.length > 0
      ? Math.min(...incomeData.map((s) => s.incomeValue))
      : 0;

  return (
    <div className="space-y-6">
      {/* Income Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-green-800">Average Income</h5>
          <p className="text-lg font-bold text-green-600">
            {averageIncome.toFixed(0)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-800">Highest Income</h5>
          <p className="text-lg font-bold text-blue-600">
            {maxIncome.toFixed(0)}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h5 className="font-medium text-orange-800">Lowest Income</h5>
          <p className="text-lg font-bold text-orange-600">
            {minIncome.toFixed(0)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h5 className="font-medium text-purple-800">Total Responses</h5>
          <p className="text-lg font-bold text-purple-600">
            {incomeData.length}
          </p>
        </div>
      </div>

      {/* Income Distribution */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Income Distribution
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={incomeRanges}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} farmers`, "Count"]} />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income by Gender */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Average Income by Gender
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={genderIncomeStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(0)}`,
                "Average Income",
              ]}
            />
            <Bar dataKey="averageIncome" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Farm Size Correlation */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Income vs Farm Size
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="farmSize"
              name="Farm Size"
              label={{
                value: "Farm Size (hectares)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              dataKey="income"
              name="Monthly Income"
              label={{
                value: "Monthly Income",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => [
                name === "farmSize" ? `${value} hectares` : `${value}`,
                name === "farmSize" ? "Farm Size" : "Income",
              ]}
            />
            <Scatter data={incomeVsFarmSize} fill="#3B82F6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Selling Methods */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Selling Methods
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sellingMethodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "count"
                  ? `${value} farmers`
                  : `${Number(value).toFixed(1)}%`,
                name === "count" ? "Count" : "Percentage",
              ]}
            />
            <Bar dataKey="count" fill="#F59E0B" name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Trends by Age */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Income by Age Group
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={incomeData
              .map((s) => ({
                age: s.age,
                income: s.incomeValue,
                gender: s.sex,
              }))
              .sort((a, b) => a.age - b.age)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}`, "Income"]} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
