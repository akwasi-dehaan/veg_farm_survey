import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Survey } from "../../lib/types";

interface GeographicAnalysisProps {
  surveys: Survey[];
}

export const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({
  surveys,
}) => {
  // Location analysis
  const locationData = surveys.reduce((acc, survey) => {
    const location = survey.farmLocation || survey.location || "Unknown";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationStats = Object.entries(locationData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([location, count]) => ({
      location,
      count,
      percentage: surveys.length > 0 ? (count / surveys.length) * 100 : 0,
    }));

  // Enumerator distribution
  const enumeratorData = surveys.reduce((acc, survey) => {
    const enumerator = survey.enumeratorName || "Unknown";
    acc[enumerator] = (acc[enumerator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const enumeratorStats = Object.entries(enumeratorData)
    .sort(([, a], [, b]) => b - a)
    .map(([enumerator, count]) => ({
      enumerator,
      count,
      percentage: surveys.length > 0 ? (count / surveys.length) * 100 : 0,
    }));

  // Geographic distribution by cultivation status
  const cultivationByLocation = surveys.reduce((acc, survey) => {
    const location = survey.farmLocation || survey.location || "Unknown";
    if (!acc[location]) {
      acc[location] = { cultivating: 0, notCultivating: 0, total: 0 };
    }
    acc[location].total++;
    if (survey.cultivatesVegetables === "yes") {
      acc[location].cultivating++;
    } else {
      acc[location].notCultivating++;
    }
    return acc;
  }, {} as Record<string, { cultivating: number; notCultivating: number; total: number }>);

  const cultivationData = Object.entries(cultivationByLocation)
    .map(([location, data]) => ({
      location,
      cultivating: data.cultivating,
      notCultivating: data.notCultivating,
      cultivationRate:
        data.total > 0 ? (data.cultivating / data.total) * 100 : 0,
    }))
    .sort((a, b) => b.cultivationRate - a.cultivationRate)
    .slice(0, 8);

  // Age distribution by location
  const ageByLocation = surveys.reduce((acc, survey) => {
    const location = survey.farmLocation || survey.location || "Unknown";
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(survey.age);
    return acc;
  }, {} as Record<string, number[]>);

  const averageAgeByLocation = Object.entries(ageByLocation)
    .map(([location, ages]) => ({
      location,
      averageAge: ages.reduce((sum, age) => sum + age, 0) / ages.length,
      count: ages.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Farm size by location
  const farmSizeByLocation = surveys.reduce((acc, survey) => {
    const location = survey.farmLocation || survey.location || "Unknown";
    if (!acc[location]) {
      acc[location] = [];
    }
    const farmSize = parseFloat(survey.areaUnderCultivation || "0");
    if (farmSize > 0) {
      acc[location].push(farmSize);
    }
    return acc;
  }, {} as Record<string, number[]>);

  const averageFarmSizeByLocation = Object.entries(farmSizeByLocation)
    .map(([location, sizes]) => ({
      location,
      averageFarmSize:
        sizes.length > 0
          ? sizes.reduce((sum, size) => sum + size, 0) / sizes.length
          : 0,
      count: sizes.length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.averageFarmSize - a.averageFarmSize)
    .slice(0, 8);

  // Top locations by survey count
  const topLocations = locationStats.slice(0, 5);
  const topLocationsPieData = topLocations.map((item, index) => ({
    name: item.location,
    value: item.count,
    color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][index],
  }));

  return (
    <div className="space-y-6">
      {/* Top Locations */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Top Locations by Survey Count
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={locationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="location"
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
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={topLocationsPieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {topLocationsPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cultivation Rate by Location */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Cultivation Rate by Location
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cultivationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "cultivating"
                  ? `${value} farmers`
                  : name === "notCultivating"
                  ? `${value} farmers`
                  : `${Number(value).toFixed(1)}%`,
                name === "cultivating"
                  ? "Cultivating"
                  : name === "notCultivating"
                  ? "Not Cultivating"
                  : "Cultivation Rate",
              ]}
            />
            <Bar
              dataKey="cultivating"
              stackId="a"
              fill="#10B981"
              name="cultivating"
            />
            <Bar
              dataKey="notCultivating"
              stackId="a"
              fill="#EF4444"
              name="notCultivating"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Average Age by Location */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Average Age by Location
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={averageAgeByLocation}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "averageAge"
                  ? `${Number(value).toFixed(1)} years`
                  : `${value} surveys`,
                name === "averageAge" ? "Average Age" : "Count",
              ]}
            />
            <Bar dataKey="averageAge" fill="#8B5CF6" name="averageAge" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Average Farm Size by Location */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Average Farm Size by Location
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={averageFarmSizeByLocation}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "averageFarmSize"
                  ? `${Number(value).toFixed(2)} hectares`
                  : `${value} farms`,
                name === "averageFarmSize" ? "Average Farm Size" : "Count",
              ]}
            />
            <Bar
              dataKey="averageFarmSize"
              fill="#F59E0B"
              name="averageFarmSize"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Enumerator Performance */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Enumerator Performance
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={enumeratorStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="enumerator"
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
            <Bar dataKey="count" fill="#10B981" name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-800">Total Locations</h5>
          <p className="text-lg font-bold text-blue-600">
            {Object.keys(locationData).length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-green-800">Active Enumerators</h5>
          <p className="text-lg font-bold text-green-600">
            {Object.keys(enumeratorData).length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h5 className="font-medium text-purple-800">Most Active Location</h5>
          <p className="text-sm font-bold text-purple-600">
            {locationStats[0]?.location || "N/A"} (
            {locationStats[0]?.count || 0} surveys)
          </p>
        </div>
      </div>
    </div>
  );
};
