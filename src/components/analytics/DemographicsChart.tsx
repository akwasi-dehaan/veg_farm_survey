import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Survey } from "../../lib/types";

interface DemographicsChartProps {
  surveys: Survey[];
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  surveys,
}) => {
  // Gender distribution data
  const genderData = [
    {
      name: "Male",
      value: surveys.filter((s) => s.sex === "male").length,
      color: "#3B82F6",
    },
    {
      name: "Female",
      value: surveys.filter((s) => s.sex === "female").length,
      color: "#EC4899",
    },
    {
      name: "Other",
      value: surveys.filter((s) => s.sex === "other").length,
      color: "#10B981",
    },
  ];

  // Age distribution data
  const ageGroups = [
    {
      name: "18-25",
      count: surveys.filter((s) => s.age >= 18 && s.age <= 25).length,
    },
    {
      name: "26-35",
      count: surveys.filter((s) => s.age >= 26 && s.age <= 35).length,
    },
    {
      name: "36-45",
      count: surveys.filter((s) => s.age >= 36 && s.age <= 45).length,
    },
    {
      name: "46-55",
      count: surveys.filter((s) => s.age >= 46 && s.age <= 55).length,
    },
    { name: "55+", count: surveys.filter((s) => s.age > 55).length },
  ];

  // Household size distribution
  const householdSizes = [
    {
      name: "1-2",
      count: surveys.filter((s) => s.householdSize >= 1 && s.householdSize <= 2)
        .length,
    },
    {
      name: "3-4",
      count: surveys.filter((s) => s.householdSize >= 3 && s.householdSize <= 4)
        .length,
    },
    {
      name: "5-6",
      count: surveys.filter((s) => s.householdSize >= 5 && s.householdSize <= 6)
        .length,
    },
    { name: "7+", count: surveys.filter((s) => s.householdSize >= 7).length },
  ];

  return (
    <div className="space-y-6">
      {/* Gender Distribution */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Gender Distribution
        </h4>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          {genderData.map((item, index) => (
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

      {/* Age Distribution */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Age Distribution
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ageGroups}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Household Size Distribution */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Household Size Distribution
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={householdSizes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
