import React from "react";
import { Survey } from "@/lib/types";

interface SurveyPreviewProps {
  data: Survey;
  onEdit: (section: number) => void;
}

export const SurveyPreview: React.FC<SurveyPreviewProps> = ({
  data,
  onEdit,
}) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "None selected";
    }
    if (typeof value === "object" && value !== null) {
      const selectedItems = Object.entries(value)
        .filter(
          ([_, item]) =>
            item &&
            typeof item === "object" &&
            "selected" in item &&
            item.selected
        )
        .map(([key, item]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          const severity = (item as any)?.severity
            ? ` (Severity: ${(item as any).severity})`
            : "";
          return `${label}${severity}`;
        });
      return selectedItems.length > 0
        ? selectedItems.join(", ")
        : "None selected";
    }
    return String(value);
  };

  const sections = [
    {
      title: "Section A: Household & Respondent Biodata",
      fields: [
        { label: "Respondent Name", value: data.respondentName },
        { label: "Sex", value: data.sex },
        { label: "Age", value: data.age },
        { label: "Marital Status", value: data.maritalStatus },
        { label: "Education Level", value: data.education },
        { label: "Main Occupation", value: data.mainOccupation },
        {
          label: "Is farming your primary income source?",
          value: data.farmingPrimaryIncome,
        },
        { label: "Household Size", value: data.householdSize },
        { label: "Dependents under 18", value: data.dependentsUnder18 },
      ],
    },
    {
      title: "Section B: Farm Profile",
      fields: [
        {
          label: "Do you currently cultivate vegetables?",
          value: data.cultivatesVegetables,
        },
        { label: "Years of cultivation", value: data.yearsOfCultivation },
        { label: "Farm location", value: data.farmLocation },
        { label: "Land ownership", value: data.landOwnership },
        ...(data.landOwnershipOther
          ? [
              {
                label: "Land ownership (other)",
                value: data.landOwnershipOther,
              },
            ]
          : []),
        { label: "Area under cultivation", value: data.areaUnderCultivation },
        { label: "Irrigation source", value: data.irrigationSource },
        ...(data.irrigationSourceOther
          ? [
              {
                label: "Irrigation source (other)",
                value: data.irrigationSourceOther,
              },
            ]
          : []),
        { label: "Farming practices", value: data.farmingPractice },
        ...(data.farmingPracticeOther
          ? [
              {
                label: "Farming practice (other)",
                value: data.farmingPracticeOther,
              },
            ]
          : []),
      ],
    },
    {
      title: "Section C: Vegetables",
      fields: [
        { label: "Vegetables grown", value: data.vegetables },
        ...(data.vegetablesOther
          ? [{ label: "Vegetables (other)", value: data.vegetablesOther }]
          : []),
        { label: "Main source of seeds", value: data.seedSource },
        ...(data.seedSourceOther
          ? [{ label: "Seed source (other)", value: data.seedSourceOther }]
          : []),
        { label: "Fertilizer type", value: data.fertilizerType },
        ...(data.fertilizerTypeOther
          ? [
              {
                label: "Fertilizer type (other)",
                value: data.fertilizerTypeOther,
              },
            ]
          : []),
        { label: "Pesticide/herbicide use", value: data.usesPesticides },
        ...(data.pesticideTypesDetails
          ? [
              {
                label: "Pesticide types details",
                value: data.pesticideTypesDetails,
              },
            ]
          : []),
      ],
    },
    {
      title: "Section D: Marketing",
      fields: [
        { label: "Do you sell your produce?", value: data.sellsProduce },
        { label: "Main buyers/market channel", value: data.mainBuyers },
        ...(data.mainBuyersOther
          ? [{ label: "Main buyers (other)", value: data.mainBuyersOther }]
          : []),
        { label: "How do you usually sell?", value: data.sellingMethod },
        ...(data.sellingMethodOther
          ? [
              {
                label: "Selling method (other)",
                value: data.sellingMethodOther,
              },
            ]
          : []),
        { label: "Average monthly income", value: data.monthlyIncome },
        {
          label: "Do you have a regular contract or buyer?",
          value: data.hasRegularBuyer,
        },
        {
          label: "Do you belong to a farmer group/cooperative?",
          value: data.belongsToGroup,
        },
        ...(data.groupName
          ? [{ label: "Group name", value: data.groupName }]
          : []),
        ...(data.groupRole
          ? [{ label: "Role in group", value: data.groupRole }]
          : []),
        ...(data.groupRoleOther
          ? [{ label: "Group role (other)", value: data.groupRoleOther }]
          : []),
        {
          label: "Farm management practices",
          value: data.farmManagementPractices,
        },
        ...(data.farmManagementPracticesOther
          ? [
              {
                label: "Management practices (other)",
                value: data.farmManagementPracticesOther,
              },
            ]
          : []),
      ],
    },
    {
      title: "Section E: Services",
      fields: [
        { label: "Extension services", value: data.hasExtensionAccess },
        { label: "Extension source", value: data.extensionSource },
        ...(data.extensionSourceOther
          ? [
              {
                label: "Extension source (other)",
                value: data.extensionSourceOther,
              },
            ]
          : []),
        { label: "Credit access", value: data.hasCredit },
        { label: "Credit source", value: data.creditSource },
        ...(data.creditSourceOther
          ? [{ label: "Credit source (other)", value: data.creditSourceOther }]
          : []),
        { label: "Input access", value: data.inputAccess },
        { label: "Has storage", value: data.hasStorage },
      ],
    },
    {
      title: "Section F: Challenges",
      fields: [
        { label: "Challenges faced", value: data.challenges },
        ...(data.challengeOther
          ? [{ label: "Other challenges", value: data.challengeOther }]
          : []),
        {
          label: "Most important challenge",
          value: data.mostImportantChallenge,
        },
        { label: "Have you tried strategies?", value: data.triedStrategies },
        ...(data.strategies
          ? [{ label: "Strategies tried", value: data.strategies }]
          : []),
        ...(data.strategiesSuccessful
          ? [
              {
                label: "Were strategies successful?",
                value: data.strategiesSuccessful,
              },
            ]
          : []),
      ],
    },
    {
      title: "Section G: Technology",
      fields: [
        { label: "Owns mobile phone", value: data.ownsMobilePhone },
        {
          label: "Uses internet for farming",
          value: data.usesInternetForFarming,
        },
        { label: "Digital platforms used", value: data.platforms },
        ...(data.platformsOther
          ? [{ label: "Platforms (other)", value: data.platformsOther }]
          : []),
      ],
    },
    {
      title: "Section H: Aspirations",
      fields: [
        { label: "Plans to continue farming", value: data.plansToContinue },
        {
          label: "What would encourage expansion 1",
          value: data.encourageExpansion1,
        },
        {
          label: "What would encourage expansion 2",
          value: data.encourageExpansion2,
        },
        {
          label: "What would encourage expansion 3",
          value: data.encourageExpansion3,
        },
        { label: "Support needed 1", value: data.supportNeeded1 },
        { label: "Support needed 2", value: data.supportNeeded2 },
        { label: "Support needed 3", value: data.supportNeeded3 },
      ],
    },
    {
      title: "Section I: Suggestions",
      fields: [
        { label: "Improvement 1", value: data.improvement1 },
        { label: "Improvement 2", value: data.improvement2 },
        { label: "Improvement 3", value: data.improvement3 },
        { label: "Additional comments", value: data.additionalComments },
        ...(data.enumeratorComments
          ? [{ label: "Enumerator comments", value: data.enumeratorComments }]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Survey Preview
        </h3>
        <p className="text-green-700">
          Please review all your answers below. You can click "Edit" on any
          section to make changes before submitting.
        </p>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {section.title}
            </h4>
            <button
              onClick={() => onEdit(index)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-1">
                <dt className="text-sm font-medium text-gray-600">
                  {field.label}
                </dt>
                <dd className="text-sm text-gray-900">
                  {formatValue(field.value)}
                </dd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
