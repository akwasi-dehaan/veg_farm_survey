import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Radio } from "../ui/Radio";
import {
  SEX_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_OPTIONS,
  YES_NO_OPTIONS,
  OCCUPATION_OPTIONS,
} from "../../lib/types";

interface SectionAProps {
  data: {
    respondentName: string;
    sex: string;
    age: number;
    maritalStatus: string;
    education: string;
    mainOccupation: string;
    farmingPrimaryIncome: string;
    householdSize: number;
    dependentsUnder18: number;
  };
  onChange: (field: string, value: string | number) => void;
  errors: { [key: string]: string };
}

export const SectionA: React.FC<SectionAProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section A: Household & Respondent Biodata
        </h3>
        <p className="text-sm text-green-700">
          Please provide basic information about the respondent and their
          household.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="A1. Respondent's Name"
          value={data.respondentName}
          onChange={(e) => onChange("respondentName", e.target.value)}
          error={errors.respondentName}
          required
        />

        <Radio
          name="sex"
          label="A2. Sex"
          options={SEX_OPTIONS}
          value={data.sex}
          onChange={(value) => onChange("sex", value)}
          error={errors.sex}
          required
        />

        <Input
          label="A3. Age (years)"
          type="number"
          min="1"
          max="120"
          value={data.age || ""}
          onChange={(e) => onChange("age", parseInt(e.target.value) || 0)}
          error={errors.age}
          required
        />

        <Select
          label="A4. Marital Status"
          options={MARITAL_STATUS_OPTIONS}
          value={data.maritalStatus}
          onChange={(e) => onChange("maritalStatus", e.target.value)}
          error={errors.maritalStatus}
          required
          placeholder="Select marital status"
        />

        <Select
          label="A5. Education Level"
          options={EDUCATION_OPTIONS}
          value={data.education}
          onChange={(e) => onChange("education", e.target.value)}
          error={errors.education}
          required
          placeholder="Select education level"
        />

        <Select
          label="A6. Main Occupation"
          options={OCCUPATION_OPTIONS}
          value={data.mainOccupation}
          onChange={(e) => onChange("mainOccupation", e.target.value)}
          error={errors.mainOccupation}
          required
          placeholder="Select Occupation"
        />

        <Radio
          name="farmingPrimaryIncome"
          label="A7. Is farming your primary source of income?"
          options={YES_NO_OPTIONS}
          value={data.farmingPrimaryIncome}
          onChange={(value) => onChange("farmingPrimaryIncome", value)}
          error={errors.farmingPrimaryIncome}
          required
        />

        <Input
          label="A8. Household Size (total number of people)"
          type="number"
          min="1"
          value={data.householdSize || ""}
          onChange={(e) =>
            onChange("householdSize", parseInt(e.target.value) || 0)
          }
          error={errors.householdSize}
          required
        />

        <Input
          label="A9. Number of dependents under 18 years"
          type="number"
          min="0"
          value={data.dependentsUnder18 || ""}
          onChange={(e) =>
            onChange("dependentsUnder18", parseInt(e.target.value) || 0)
          }
          error={errors.dependentsUnder18}
          required
        />
      </div>
    </div>
  );
};
