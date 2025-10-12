import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Radio } from "../ui/Radio";
import { YES_NO_OPTIONS } from "../../lib/types";

interface SectionEProps {
  data: {
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
  };
  onChange: (field: string, value: string) => void;
  errors: { [key: string]: string };
}

const EXTENSION_SOURCE_OPTIONS = [
  { value: "government", label: "Government extension" },
  { value: "ngo", label: "NGO" },
  { value: "private", label: "Private company" },
  { value: "farmer_group", label: "Farmer group" },
  { value: "mobile/online_advisory", label: "Mobile/online advisory" },
  { value: "other", label: "Other" },
];

const CREDIT_SOURCE_OPTIONS = [
  { value: "bank", label: "Bank" },
  { value: "microfinance", label: "Microfinance institution" },
  { value: "SACCO/cooperative", label: "SACCO/cooperative" },
  { value: "informal_lender", label: "Informal lender" },
  { value: "family", label: "Family/friends" },
  { value: "ngo_grants", label: "NGO grants" },
  { value: "other", label: "Other" },
];

const INPUT_ACCESS_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "sometimes", label: "Sometimes" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
];

export const SectionE: React.FC<SectionEProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section E: Access to Services, Inputs & Finance
        </h3>
        <p className="text-sm text-green-700">
          Information about access to extension services, training, credit, and
          inputs.
        </p>
      </div>

      <Radio
        name="hasExtensionAccess"
        label="E1. Do you have access to extension/advisory services?"
        options={YES_NO_OPTIONS}
        value={data.hasExtensionAccess}
        onChange={(value) => onChange("hasExtensionAccess", value)}
        error={errors.hasExtensionAccess}
        required
      />

      {data.hasExtensionAccess === "yes" && (
        <>
          <Select
            label="Source of extension services"
            options={EXTENSION_SOURCE_OPTIONS}
            value={data.extensionSource}
            onChange={(e) => onChange("extensionSource", e.target.value)}
            error={errors.extensionSource}
            required
            placeholder="Select extension source"
          />

          {data.extensionSource === "other" && (
            <Input
              label="Please specify other extension source"
              value={data.extensionSourceOther || ""}
              onChange={(e) => onChange("extensionSourceOther", e.target.value)}
              placeholder="Enter other extension source"
              error={errors.extensionSourceOther}
              required
            />
          )}
        </>
      )}

      <Radio
        name="receivedTraining"
        label="E2. Have you received any training in the last 3 years?"
        options={YES_NO_OPTIONS}
        value={data.receivedTraining}
        onChange={(value) => onChange("receivedTraining", value)}
        error={errors.receivedTraining}
        required
      />

      {data.receivedTraining === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Training topics"
            value={data.trainingTopics}
            onChange={(e) => onChange("trainingTopics", e.target.value)}
            error={errors.trainingTopics}
            required
            placeholder="e.g., Crop production, Pest management"
          />

          <Input
            label="Year of training"
            value={data.trainingYear}
            onChange={(e) => onChange("trainingYear", e.target.value)}
            error={errors.trainingYear}
            required
            placeholder="e.g., 2023"
          />
        </div>
      )}

      <Radio
        name="hasCredit"
        label="E3. Do you have access to credit/loans for farming activities?"
        options={YES_NO_OPTIONS}
        value={data.hasCredit}
        onChange={(value) => onChange("hasCredit", value)}
        error={errors.hasCredit}
        required
      />

      {data.hasCredit === "yes" && (
        <>
          <Select
            label="Source of credit"
            options={CREDIT_SOURCE_OPTIONS}
            value={data.creditSource}
            onChange={(e) => onChange("creditSource", e.target.value)}
            error={errors.creditSource}
            required
            placeholder="Select credit source"
          />

          {data.creditSource === "other" && (
            <Input
              label="Please specify other credit source"
              value={data.creditSourceOther || ""}
              onChange={(e) => onChange("creditSourceOther", e.target.value)}
              placeholder="Enter other credit source"
              error={errors.creditSourceOther}
              required
            />
          )}
        </>
      )}

      <Select
        label="E4. Do you have access to inputs (seed, fertilizer, agrochemicals) when needed?"
        options={INPUT_ACCESS_OPTIONS}
        value={data.inputAccess}
        onChange={(e) => onChange("inputAccess", e.target.value)}
        error={errors.inputAccess}
        required
        placeholder="Select access level"
      />

      <Radio
        name="hasStorage"
        label="E5. Do you have storage/packaging facilities for your produce?"
        options={YES_NO_OPTIONS}
        value={data.hasStorage}
        onChange={(value) => onChange("hasStorage", value)}
        error={errors.hasStorage}
        required
      />
    </div>
  );
};
