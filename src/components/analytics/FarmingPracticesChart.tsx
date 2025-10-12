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

interface FarmingPracticesChartProps {
  surveys: Survey[];
}

export const FarmingPracticesChart: React.FC<FarmingPracticesChartProps> = ({
  surveys,
}) => {
  // Vegetable types analysis
  const vegetableTypes = surveys.reduce((acc, survey) => {
    if (survey.vegetables) {
      Object.keys(survey.vegetables).forEach((vegetable) => {
        if (survey.vegetables[vegetable]?.selected) {
          acc[vegetable] = (acc[vegetable] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const vegetableData = Object.entries(vegetableTypes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Farming practice analysis
  const farmingPractices = surveys.reduce((acc, survey) => {
    if (survey.farmingPractice && Array.isArray(survey.farmingPractice)) {
      survey.farmingPractice.forEach((practice) => {
        acc[practice] = (acc[practice] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const practiceData = Object.entries(farmingPractices).map(
    ([name, value]) => ({ name, value })
  );

  // Seed source analysis
  const seedSources = surveys.reduce((acc, survey) => {
    if (survey.seedSource && Array.isArray(survey.seedSource)) {
      survey.seedSource.forEach((source) => {
        acc[source] = (acc[source] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const seedSourceData = Object.entries(seedSources).map(([name, value]) => ({
    name,
    value,
  }));

  // Cultivation status
  const cultivationData = [
    {
      name: "Cultivating",
      value: surveys.filter((s) => s.cultivatesVegetables === "yes").length,
      color: "#10B981",
    },
    {
      name: "Not Cultivating",
      value: surveys.filter((s) => s.cultivatesVegetables === "no").length,
      color: "#EF4444",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cultivation Status */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Cultivation Status
        </h4>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={cultivationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {cultivationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          {cultivationData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Vegetable Types */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Most Popular Vegetables
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={vegetableData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Farming Practices */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Farming Practices
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={practiceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Seed Sources */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Seed Sources</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={seedSourceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
