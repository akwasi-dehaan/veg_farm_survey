import React from "react";
import { Input } from "../ui/Input";
import { Radio } from "../ui/Radio";
import { YES_NO_OPTIONS } from "../../lib/types";

interface SectionHProps {
  data: {
    plansToContinue: string;
    encourageExpansion1: string;
    encourageExpansion2: string;
    encourageExpansion3: string;
    supportNeeded1: string;
    supportNeeded2: string;
    supportNeeded3: string;
  };
  onChange: (field: string, value: string) => void;
  errors: { [key: string]: string };
}

export const SectionH: React.FC<SectionHProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section H: Perceptions & Aspirations
        </h3>
        <p className="text-sm text-green-700">
          Information about future plans and aspirations in vegetable farming.
        </p>
      </div>

      <Radio
        name="plansToContinue"
        label="H1. Do you plan to continue vegetable farming in the next 5 years?"
        options={YES_NO_OPTIONS}
        value={data.plansToContinue}
        onChange={(value) => onChange("plansToContinue", value)}
        error={errors.plansToContinue}
        required
      />

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">
          H2. What would most encourage you to expand production? (list top 3)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="1st priority"
            value={data.encourageExpansion1}
            onChange={(e) => onChange("encourageExpansion1", e.target.value)}
            error={errors.encourageExpansion1}
            required
            placeholder="e.g., Better market prices"
          />
          <Input
            label="2nd priority"
            value={data.encourageExpansion2}
            onChange={(e) => onChange("encourageExpansion2", e.target.value)}
            error={errors.encourageExpansion2}
            required
            placeholder="e.g., Access to credit"
          />
          <Input
            label="3rd priority"
            value={data.encourageExpansion3}
            onChange={(e) => onChange("encourageExpansion3", e.target.value)}
            error={errors.encourageExpansion3}
            required
            placeholder="e.g., Technical training"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">
          H3. What support do you most need from government/NGOs/private sector?
          (list top 3)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="1st priority"
            value={data.supportNeeded1}
            onChange={(e) => onChange("supportNeeded1", e.target.value)}
            error={errors.supportNeeded1}
            required
            placeholder="e.g., Training on pest management"
          />
          <Input
            label="2nd priority"
            value={data.supportNeeded2}
            onChange={(e) => onChange("supportNeeded2", e.target.value)}
            error={errors.supportNeeded2}
            required
            placeholder="e.g., Access to quality seeds"
          />
          <Input
            label="3rd priority"
            value={data.supportNeeded3}
            onChange={(e) => onChange("supportNeeded3", e.target.value)}
            error={errors.supportNeeded3}
            required
            placeholder="e.g., Market linkages"
          />
        </div>
      </div>
    </div>
  );
};
