import { Survey } from "./types";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSurvey(survey: Survey): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!survey.enumeratorName?.trim()) {
    errors.push({
      field: "enumeratorName",
      message: "Enumerator name is required",
    });
  }
  if (!survey.location?.trim()) {
    errors.push({ field: "location", message: "Location is required" });
  }
  if (!survey.consent || survey.consent !== "yes") {
    errors.push({ field: "consent", message: "Consent is required" });
  }
  if (!survey.respondentName?.trim()) {
    errors.push({
      field: "respondentName",
      message: "Respondent name is required",
    });
  }
  if (!survey.sex) {
    errors.push({ field: "sex", message: "Sex is required" });
  }
  if (!survey.age || survey.age < 1) {
    errors.push({ field: "age", message: "Valid age is required" });
  }
  if (!survey.maritalStatus) {
    errors.push({
      field: "maritalStatus",
      message: "Marital status is required",
    });
  }
  if (!survey.education) {
    errors.push({ field: "education", message: "Education level is required" });
  }
  if (!survey.mainOccupation?.trim()) {
    errors.push({
      field: "mainOccupation",
      message: "Main occupation is required",
    });
  }
  if (!survey.farmingPrimaryIncome) {
    errors.push({
      field: "farmingPrimaryIncome",
      message: "Please specify if farming is primary income",
    });
  }
  if (!survey.householdSize || survey.householdSize < 1) {
    errors.push({
      field: "householdSize",
      message: "Valid household size is required",
    });
  }
  if (survey.dependentsUnder18 === undefined || survey.dependentsUnder18 < 0) {
    errors.push({
      field: "dependentsUnder18",
      message: "Number of dependents under 18 is required",
    });
  }
  if (!survey.cultivatesVegetables) {
    errors.push({
      field: "cultivatesVegetables",
      message: "Please specify if you cultivate vegetables",
    });
  }

  return errors;
}

export function generateSurveyId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `SURV-${timestamp}-${random}`.toUpperCase();
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}
