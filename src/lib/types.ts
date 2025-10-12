export interface Survey {
  surveyId: string;
  enumeratorName: string;
  date: string;
  location: string;
  consent: string;
  timestamp: string;
  syncStatus: "pending" | "synced" | "failed";
  syncedAt?: string;

  // Section A: Biodata
  respondentName: string;
  sex: string;
  age: number;
  maritalStatus: string;
  education: string;
  mainOccupation: string;
  farmingPrimaryIncome: string;
  householdSize: number;
  dependentsUnder18: number;

  // Section B: Farm Profile
  cultivatesVegetables: string;
  yearsOfCultivation: number;
  farmLocation: string;
  landOwnership: string;
  landOwnershipOther?: string;
  areaUnderCultivation: string;
  farmingPractice: string[];
  farmingPracticeOther?: string;
  irrigates: string;
  irrigationSource: string;
  irrigationSourceOther?: string;
  cultivationFrequency: string;
  leverageTechnology: string;

  // Section C: Vegetables
  vegetables: {
    [key: string]: { selected: boolean; area?: string; yield?: string };
  };
  vegetablesOther?: string;
  seedSource: string[];
  seedSourceOther?: string;
  avgProductionPerSeason: string;
  usesFertilizers: string;
  fertilizerType: string;
  fertilizerTypeOther?: string;
  usesPesticides: string;
  pesticideTypesDetails: string;

  // Section D: Marketing
  sellsProduce: string;
  mainBuyers: string[];
  mainBuyersOther?: string;
  sellingMethod: string;
  sellingMethodOther?: string;
  monthlyIncome: string;
  hasRegularBuyer: string;
  belongsToGroup: string; // D6 field
  groupName: string;
  groupRole: string;
  groupRoleOther?: string;
  farmManagementPractices: string;
  farmManagementPracticesOther?: string;

  // Section E: Services
  hasExtensionAccess: string;
  extensionSource: string;
  extensionSourceOther?: string;
  receivedTraining: string;
  trainingTopics: string;
  trainingYear: string;
  hasCredit: string;
  creditSource: string;
  creditSourceOther?: string;
  inputAccess: string;
  hasStorage: string;

  // Section F: Challenges
  challenges: {
    [key: string]: {
      selected: boolean;
      severity?: number;
      description?: string;
    };
  };
  challengeOther: string;
  mostImportantChallenge: string;
  triedStrategies: string;
  strategies: string;
  strategiesSuccessful: string;

  // Section G: Technology
  ownsMobilePhone: string;
  usesInternetForFarming: string;
  platforms: string[];
  platformsOther?: string;
  wouldUseSMS: string;
  interestedInClimate: string;

  // Section H: Aspirations
  plansToContinue: string;
  encourageExpansion1: string;
  encourageExpansion2: string;
  encourageExpansion3: string;
  supportNeeded1: string;
  supportNeeded2: string;
  supportNeeded3: string;

  // Section I: Suggestions
  improvement1: string;
  improvement2: string;
  improvement3: string;
  additionalComments: string;
  enumeratorComments: string;
}

export interface NotificationState {
  show: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "other", label: "Other" },
];

export const EDUCATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "primary", label: "Primary" },
  { value: "jhs/lower_secondary", label: "JHS/Lower secondary" },
  { value: "shs/upper_secondary", label: "SHS/Upper secondary" },
  { value: "vocational/technical", label: "Vocational/Technical" },
  { value: "diploma", label: "Diploma/Certificate" },
  { value: "bachelor", label: "Bachelor's degree" },
  { value: "master", label: "Master's degree" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

export const OCCUPATION_OPTIONS = [
  { value: "vegetable_farmer", label: "Vegetable Farmer" },
  { value: "student", label: "Student" },
  { value: "employed_non_farming", label: "Employed (non-farming)" },
  { value: "other_farm_worker", label: "Other farm worker" },
  { value: "not_applicable", label: "Not applicable" },
];

export const FARMING_PRACTICE_OPTIONS = [
  { value: "open_field", label: "Open field" },
  { value: "bed_system", label: "Bed system" },
  { value: "protected", label: "Protected (greenhouse/poly-tunnel)" },
  { value: "vertical_urban", label: "Vertical/urban beds" },
  { value: "other", label: "Other" },
];

export const VEGETABLE_OPTIONS = [
  { value: "tomato", label: "Tomato" },
  { value: "pepper", label: "Pepper" },
  { value: "onion", label: "Onion" },
  { value: "cabbage", label: "Cabbage" },
  { value: "garden_eggs", label: "Garden eggs" },
  { value: "okra", label: "Okra" },
  { value: "carrot", label: "Carrot" },
  { value: "lettuce", label: "Lettuce" },
  { value: "cucumber", label: "Cucumber" },
  { value: "other", label: "Other" },
];

export const CHALLENGE_OPTIONS = [
  { value: "lack_quality_seed", label: "Lack of quality seed" },
  {
    value: "high_cost_inputs",
    label: "High cost of inputs (fertilizer, pesticides)",
  },
  { value: "pest_disease", label: "Pest and disease problems" },
  { value: "water_shortage", label: "Water shortage/irrigation issues" },
  { value: "market_access", label: "Lack of access to markets / low prices" },
  {
    value: "transport_cost",
    label: "Lack of transport or high transport cost",
  },
  { value: "post_harvest_losses", label: "Post-harvest losses" },
  { value: "lack_credit", label: "Lack of credit/finance" },
  { value: "lack_training", label: "Lack of training/knowledge" },
  { value: "land_access", label: "Land access/tenure insecurity" },
  { value: "weather_climate", label: "Weather/climate variability" },
  { value: "theft_vandalism", label: "Theft/vandalism" },
  { value: "gender_constraints", label: "Gender-related constraints" },
  { value: "other", label: "Other (specify)" },
];

export const SEVERITY_OPTIONS = [
  { value: "1", label: "1 - Not a problem" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5 - Very severe" },
];

export interface ExportOptions {
  format: "csv" | "json";
  filename?: string;
}

export interface SyncResult {
  success: number;
  failed: number;
}
