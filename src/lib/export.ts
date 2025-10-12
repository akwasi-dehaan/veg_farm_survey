import { Survey } from "./types";

export function exportToCSV(surveys: Survey[]): string {
  if (surveys.length === 0) return "";

  const headers = [
    "Survey ID",
    "Enumerator Name",
    "Date",
    "Location",
    "Respondent Name",
    "Sex",
    "Age",
    "Marital Status",
    "Education",
    "Main Occupation",
    "Farming Primary Income",
    "Household Size",
    "Dependents Under 18",
    "Cultivates Vegetables",
    "Years of Cultivation",
    "Farm Location",
    "Land Ownership",
    "Area Under Cultivation",
    "Farming Practice",
    "Irrigates",
    "Irrigation Source",
    "Cultivation Frequency",
    "Leverage Technology",
    "Timestamp",
    "Sync Status",
  ];

  const rows = surveys.map((survey) => [
    survey.surveyId,
    survey.enumeratorName,
    survey.date,
    survey.location,
    survey.respondentName,
    survey.sex,
    survey.age,
    survey.maritalStatus,
    survey.education,
    survey.mainOccupation,
    survey.farmingPrimaryIncome,
    survey.householdSize,
    survey.dependentsUnder18,
    survey.cultivatesVegetables,
    survey.yearsOfCultivation,
    survey.farmLocation,
    survey.landOwnership,
    survey.areaUnderCultivation,
    survey.farmingPractice,
    survey.irrigates,
    survey.irrigationSource,
    survey.cultivationFrequency,
    survey.leverageTechnology,
    survey.timestamp,
    survey.syncStatus,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
}

export function downloadCSV(
  csvContent: string,
  filename: string = "youth-farming-surveys.csv"
): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToJSON(surveys: Survey[]): string {
  return JSON.stringify(surveys, null, 2);
}

export function downloadJSON(
  jsonContent: string,
  filename: string = "youth-farming-surveys.json"
): void {
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportSurveys(
  surveys: Survey[],
  format: "csv" | "json",
  filename?: string
): void {
  if (format === "csv") {
    const csvContent = exportToCSV(surveys);
    downloadCSV(csvContent, filename);
  } else {
    const jsonContent = exportToJSON(surveys);
    downloadJSON(jsonContent, filename);
  }
}
