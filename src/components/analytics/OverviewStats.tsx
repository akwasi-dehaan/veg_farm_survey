import React from "react";

// Custom SVG Icons to replace lucide-react
const UsersIcon = ({ className }: { className?: string }) => (
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
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
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
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
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
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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

interface OverviewStatsProps {
  analyticsData: AnalyticsData;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  analyticsData,
}) => {
  const stats = [
    {
      title: "Total Surveys",
      value: analyticsData.totalSurveys,
      icon: UsersIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Age",
      value: `${analyticsData.averageAge.toFixed(1)} years`,
      icon: TrendingUpIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cultivating Vegetables",
      value: `${(
        (analyticsData.cultivationStatus.yes / analyticsData.totalSurveys) *
        100
      ).toFixed(1)}%`,
      icon: CalendarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Average Farm Size",
      value: `${analyticsData.averageFarmSize.toFixed(2)} hectares`,
      icon: MapPinIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
