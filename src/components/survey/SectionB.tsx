import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Radio } from "../ui/Radio";
import { Checkbox } from "../ui/Checkbox";
import { YES_NO_OPTIONS, FARMING_PRACTICE_OPTIONS } from "@/lib/types";

interface SectionBProps {
  data: {
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
  };
  onChange: (field: string, value: string | number | string[]) => void;
  errors: { [key: string]: string };
}

const LAND_OWNERSHIP_OPTIONS = [
  { value: "owned", label: "Owned" },
  { value: "rented/leased", label: "Rented/Leased" },
  { value: "borrowed", label: "Borrowed" },
  { value: "family_land/shared", label: "Family Land/Shared" },
  { value: "communal ", label: "Communal" },
  { value: "other", label: "Other" },
];

const IRRIGATION_SOURCE_OPTIONS = [
  { value: "river", label: "River" },
  { value: "well", label: "Well" },
  { value: "borehole", label: "Borehole" },
  { value: "rain", label: "Rain-fed only" },
  { value: "tank/pond", label: "Tank/Pond" },
  { value: "municipal_supply", label: "Municipal Supply" },
  { value: "drip/pipe", label: "Drip/Pipe" },
  { value: "other", label: "Other" },
];

const CULTIVATION_FREQUENCY_OPTIONS = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "seasonally", label: "Seasonally (Specify months)" },
];

export const SectionB: React.FC<SectionBProps> = ({
  data,
  onChange,
  errors,
}) => {
  const showFarmDetails = data.cultivatesVegetables === "yes";

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section B: Farm/Production Profile
        </h3>
        <p className="text-sm text-green-700">
          Information about the respondent&apos;s farming activities and
          practices.
        </p>
      </div>

      <Radio
        name="cultivatesVegetables"
        label="B1. Do you currently cultivate vegetables?"
        options={YES_NO_OPTIONS}
        value={data.cultivatesVegetables}
        onChange={(value) => onChange("cultivatesVegetables", value)}
        error={errors.cultivatesVegetables}
        required
      />

      {data.cultivatesVegetables === "no" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Skip Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Since you do not currently cultivate vegetables, you will skip
                  to Section F (Challenges & Constraints) after clicking Next.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFarmDetails && (
        <div className="space-y-6">
          <Input
            label="B2. How many years have you been cultivating vegetables?"
            type="number"
            min="0"
            value={data.yearsOfCultivation || ""}
            onChange={(e) =>
              onChange("yearsOfCultivation", parseInt(e.target.value) || 0)
            }
            error={errors.yearsOfCultivation}
            required
          />

          <Input
            label="B3. Location of your farm (plot name / community)"
            value={data.farmLocation}
            onChange={(e) => onChange("farmLocation", e.target.value)}
            error={errors.farmLocation}
            required
          />

          <Select
            label="B4. Land ownership status"
            options={LAND_OWNERSHIP_OPTIONS}
            value={data.landOwnership}
            onChange={(e) => onChange("landOwnership", e.target.value)}
            error={errors.landOwnership}
            required
            placeholder="Select land ownership"
          />

          {data.landOwnership === "other" && (
            <Input
              label="Please specify other land ownership"
              value={data.landOwnershipOther || ""}
              onChange={(e) => onChange("landOwnershipOther", e.target.value)}
              placeholder="Enter other land ownership"
              error={errors.landOwnershipOther}
              required
            />
          )}

          <Input
            label="B5. Area under vegetable cultivation (acres/hectares)"
            value={data.areaUnderCultivation}
            onChange={(e) => onChange("areaUnderCultivation", e.target.value)}
            error={errors.areaUnderCultivation}
            required
          />

          <Checkbox
            name="farmingPractice"
            label="B6. Do you practice:"
            options={FARMING_PRACTICE_OPTIONS}
            values={data.farmingPractice}
            onChange={(values) => onChange("farmingPractice", values)}
            error={errors.farmingPractice}
            required
          />

          {data.farmingPractice.includes("other") && (
            <Input
              label="Please specify other farming practice"
              value={data.farmingPracticeOther || ""}
              onChange={(e) => onChange("farmingPracticeOther", e.target.value)}
              placeholder="Enter other farming practice"
              error={errors.farmingPracticeOther}
              required
            />
          )}

          <Radio
            name="irrigates"
            label="B7. Do you irrigate your vegetables?"
            options={YES_NO_OPTIONS}
            value={data.irrigates}
            onChange={(value) => onChange("irrigates", value)}
            error={errors.irrigates}
            required
          />

          {data.irrigates === "yes" && (
            <>
              <Select
                label="B8. Source of irrigation water"
                options={IRRIGATION_SOURCE_OPTIONS}
                value={data.irrigationSource}
                onChange={(e) => onChange("irrigationSource", e.target.value)}
                error={errors.irrigationSource}
                required
                placeholder="Select irrigation source"
              />

              {data.irrigationSource === "other" && (
                <Input
                  label="Please specify other irrigation source"
                  value={data.irrigationSourceOther || ""}
                  onChange={(e) =>
                    onChange("irrigationSourceOther", e.target.value)
                  }
                  placeholder="Enter other irrigation source"
                  error={errors.irrigationSourceOther}
                  required
                />
              )}
            </>
          )}

          <Select
            label="B9. How often do you cultivate vegetables?"
            options={CULTIVATION_FREQUENCY_OPTIONS}
            value={data.cultivationFrequency}
            onChange={(e) => onChange("cultivationFrequency", e.target.value)}
            error={errors.cultivationFrequency}
            required
            placeholder="Select cultivation frequency"
          />

          <Radio
            name="leverageTechnology"
            label="B10. Do you use any technology in your farming?"
            options={YES_NO_OPTIONS}
            value={data.leverageTechnology}
            onChange={(value) => onChange("leverageTechnology", value)}
            error={errors.leverageTechnology}
            required
          />
        </div>
      )}
    </div>
  );
};
