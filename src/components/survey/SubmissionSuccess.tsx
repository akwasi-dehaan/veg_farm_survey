import React from "react";
import { Button } from "../ui/Button";
import { Survey } from "../../lib/types";

interface SubmissionSuccessProps {
  survey: Survey;
  onNewSurvey: () => void;
  onViewDashboard: () => void;
  onExportData: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  survey,
  onNewSurvey,
  onViewDashboard,
  onExportData,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Survey Submitted Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for completing the Youth Vegetable Farming Survey
          </p>
        </div>

        {/* Survey Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Survey Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Respondent</p>
              <p className="font-medium text-gray-900">
                {survey.respondentName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Enumerator</p>
              <p className="font-medium text-gray-900">
                {survey.enumeratorName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{survey.farmLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Area Under Cultivation</p>
              <p className="font-medium text-gray-900">
                {survey.areaUnderCultivation} hectares
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What's Next?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                Your survey data has been saved and synced to the server
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Data will be used for research and policy development</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={onNewSurvey} variant="primary" className="flex-1">
            <svg
              className="w-4 h-4 mr-2"
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
            Start New Survey
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Survey ID: <span className="font-mono">{survey.surveyId}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Submitted: {new Date(survey.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
