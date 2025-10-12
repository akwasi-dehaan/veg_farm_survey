import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import { VEGETABLE_OPTIONS, YES_NO_OPTIONS } from "@/lib/types";

interface SectionCProps {
  data: {
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
  };
  onChange: (field: string, value: string | number | object) => void;
  errors: { [key: string]: string };
}

const SEED_SOURCE_OPTIONS = [
  { value: "own_saved", label: "Own saved seed" },
  { value: "purchased", label: "Purchased seed" },
  { value: "seedlings", label: "Seedlings/transplants" },
  { value: "community", label: "Community seed/other" },
];

const FERTILIZER_TYPE_OPTIONS = [
  { value: "organic", label: "Organic (manure, compost, etc.)" },
  { value: "inorganic", label: "Inorganic (NPK, Urea, etc.)" },
  { value: "both", label: "Both" },
  { value: "other", label: "Other" },
];

export const SectionC: React.FC<SectionCProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleVegetableChange = (
    vegetable: string,
    field: "selected" | "area" | "yield",
    value: string | boolean
  ) => {
    const updatedVegetables = {
      ...data.vegetables,
      [vegetable]: {
        ...data.vegetables[vegetable],
        [field]: value,
      },
    };
    onChange("vegetables", updatedVegetables);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section C: Types of Vegetables & Production
        </h3>
        <p className="text-sm text-green-700">
          Information about the types of vegetables cultivated and production
          details.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">
          C1. Types of vegetables cultivated (select all that apply)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VEGETABLE_OPTIONS.map((vegetable) => (
            <div key={vegetable.value} className="border rounded-lg p-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.vegetables[vegetable.value]?.selected || false}
                  onChange={(e) =>
                    handleVegetableChange(
                      vegetable.value,
                      "selected",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {vegetable.label}
                </span>
              </label>

              {data.vegetables[vegetable.value] && (
                <div className="mt-3 space-y-3">
                  <Input
                    label="Area cultivated (acres/hectares)"
                    value={data.vegetables[vegetable.value]?.area || ""}
                    onChange={(e) =>
                      handleVegetableChange(
                        vegetable.value,
                        "area",
                        e.target.value
                      )
                    }
                    placeholder="Enter area"
                  />
                  <Input
                    label="Average yield per season (kg)"
                    value={data.vegetables[vegetable.value]?.yield || ""}
                    onChange={(e) =>
                      handleVegetableChange(
                        vegetable.value,
                        "yield",
                        e.target.value
                      )
                    }
                    placeholder="Enter yield"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {data.vegetables.other?.selected && (
          <Input
            label="Please specify other vegetables"
            value={data.vegetablesOther || ""}
            onChange={(e) => onChange("vegetablesOther", e.target.value)}
            placeholder="Enter other vegetables"
            error={errors.vegetablesOther}
            required
          />
        )}
      </div>

      <Checkbox
        name="seedSource"
        label="C2. Do you grow from:"
        options={SEED_SOURCE_OPTIONS}
        values={data.seedSource}
        onChange={(values) => onChange("seedSource", values)}
        error={errors.seedSource}
        required
      />

      {data.seedSource.includes("community") && (
        <Input
          label="Please specify other seed source"
          value={data.seedSourceOther || ""}
          onChange={(e) => onChange("seedSourceOther", e.target.value)}
          placeholder="Enter other seed source"
          error={errors.seedSourceOther}
          required
        />
      )}

      <Input
        label="C3. Average production per season (kg)"
        value={data.avgProductionPerSeason}
        onChange={(e) => onChange("avgProductionPerSeason", e.target.value)}
        error={errors.avgProductionPerSeason}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            C4. Do you use fertilizers?
          </label>
          <div className="space-y-2">
            {YES_NO_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="usesFertilizers"
                  value={option.value}
                  checked={data.usesFertilizers === option.value}
                  onChange={(e) => onChange("usesFertilizers", e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.usesFertilizers && (
            <p className="text-sm text-red-600 mt-1">
              {errors.usesFertilizers}
            </p>
          )}
        </div>

        {data.usesFertilizers === "yes" && (
          <>
            <Select
              label="Type of fertilizers used()"
              options={FERTILIZER_TYPE_OPTIONS}
              value={data.fertilizerType}
              onChange={(e) => onChange("fertilizerType", e.target.value)}
              error={errors.fertilizerType}
              required
              placeholder="Select fertilizer type"
            />

            {data.fertilizerType === "other" && (
              <Input
                label="Please specify other fertilizer type"
                value={data.fertilizerTypeOther || ""}
                onChange={(e) =>
                  onChange("fertilizerTypeOther", e.target.value)
                }
                placeholder="Enter other fertilizer type"
                error={errors.fertilizerTypeOther}
                required
              />
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            C5. Do you use pesticides/herbicides?
          </label>
          <div className="space-y-2">
            {YES_NO_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="usesPesticides"
                  value={option.value}
                  checked={data.usesPesticides === option.value}
                  onChange={(e) => onChange("usesPesticides", e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.usesPesticides && (
            <p className="text-sm text-red-600 mt-1">{errors.usesPesticides}</p>
          )}
        </div>

        {data.usesPesticides === "yes" && (
          <Input
            label="C5a. Which types (local names/active ingredient if known):"
            value={data.pesticideTypesDetails}
            onChange={(e) => onChange("pesticideTypesDetails", e.target.value)}
            placeholder="Enter pesticide/herbicide types"
            error={errors.pesticideTypesDetails}
            required
          />
        )}
      </div>
    </div>
  );
};
