import React from "react";
import { Button } from "../ui/Button";
import { StatusIndicator } from "../shared/StatusIndicator";
import { Survey } from "@/lib/types";

// Custom SVG Icons
const XIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="h-4 w-4 text-green-500"
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

const MapPinIcon = () => (
  <svg
    className="h-4 w-4 text-green-500"
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

const UserIcon = () => (
  <svg
    className="h-4 w-4 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const WifiIcon = () => (
  <svg
    className="h-4 w-4 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
);

interface SurveyDetailProps {
  survey: Survey;
  onClose: () => void;
}

export const SurveyDetail: React.FC<SurveyDetailProps> = ({
  survey,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSection = (title: string, data: Survey, fields: string[]) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium text-gray-500 capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <p className="text-sm text-gray-900">
                {String(
                  (data as unknown as Record<string, unknown>)[field] ||
                    "Not specified"
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVegetables = () => {
    if (!survey.vegetables) return null;

    const selectedVegetables = Object.keys(survey.vegetables).filter(
      (veg) => survey.vegetables[veg]
    );

    if (selectedVegetables.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vegetables Cultivated
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedVegetables.map((vegetable) => (
            <div key={vegetable} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{vegetable}</h4>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChallenges = () => {
    if (!survey.challenges) return null;

    const selectedChallenges = Object.keys(survey.challenges).filter(
      (challenge) => survey.challenges[challenge]
    );

    if (selectedChallenges.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Challenges Faced
        </h3>
        <div className="space-y-3">
          {selectedChallenges.map((challenge) => (
            <div key={challenge} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">{challenge}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Survey Details
            </h2>
            <p className="text-sm text-gray-600">
              Survey ID: {survey.surveyId}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusIndicator status={survey.syncStatus} />
            <Button onClick={onClose} variant="outline" size="sm">
              <XIcon />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Survey Info */}
            <div className="bg-green-100 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon />
                  <span className="text-sm text-gray-600">
                    {formatDate(survey.timestamp)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon />
                  <span className="text-sm text-gray-600">
                    {survey.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon />
                  <span className="text-sm text-gray-600">
                    {survey.enumeratorName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <WifiIcon />
                  <span className="text-sm text-gray-600">
                    {survey.syncedAt
                      ? `Synced: ${formatDate(survey.syncedAt)}`
                      : "Not synced"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section A: Biodata */}
            {renderSection("Section A: Biodata", survey, [
              "respondentName",
              "sex",
              "age",
              "maritalStatus",
              "education",
              "mainOccupation",
              "farmingPrimaryIncome",
              "householdSize",
              "dependentsUnder18",
            ])}

            {/* Section B: Farm Profile */}
            {survey.cultivatesVegetables === "yes" &&
              renderSection("Section B: Farm Profile", survey, [
                "yearsOfCultivation",
                "farmLocation",
                "landOwnership",
                "areaUnderCultivation",
                "farmingPractice",
                "irrigates",
                "irrigationSource",
                "cultivationFrequency",
                "leverageTechnology",
              ])}

            {/* Section C: Vegetables */}
            {renderVegetables()}

            {/* Section D: Marketing */}
            {survey.sellsProduce === "yes" &&
              renderSection("Section D: Marketing", survey, [
                "mainBuyers",
                "sellingMethod",
                "monthlyIncome",
                "hasRegularBuyer",
                "belongsToGroup",
                "groupName",
                "groupRole",
                "farmManagementPractices",
              ])}

            {/* Section E: Services */}
            {renderSection("Section E: Services & Finance", survey, [
              "hasExtensionAccess",
              "extensionSource",
              "receivedTraining",
              "trainingTopics",
              "trainingYear",
              "hasCredit",
              "creditSource",
              "inputAccess",
              "hasStorage",
            ])}

            {/* Section F: Challenges */}
            {renderChallenges()}

            {/* Section G: Technology */}
            {renderSection("Section G: Technology", survey, [
              "ownsMobilePhone",
              "usesInternetForFarming",
              "platforms",
              "wouldUseSMS",
              "interestedInClimate",
            ])}

            {/* Section H: Aspirations */}
            {renderSection("Section H: Aspirations", survey, [
              "plansToContinue",
              "encourageExpansion1",
              "encourageExpansion2",
              "encourageExpansion3",
              "supportNeeded1",
              "supportNeeded2",
              "supportNeeded3",
            ])}

            {/* Section I: Suggestions */}
            {renderSection("Section I: Suggestions", survey, [
              "improvement1",
              "improvement2",
              "improvement3",
              "additionalComments",
              "enumeratorComments",
            ])}
          </div>
        </div>
      </div>
    </div>
  );
};
