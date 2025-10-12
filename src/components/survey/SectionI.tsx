import React from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface SectionIProps {
  data: {
    improvement1: string;
    improvement2: string;
    improvement3: string;
    additionalComments: string;
    enumeratorComments: string;
  };
  onChange: (field: string, value: string) => void;
  errors: { [key: string]: string };
}

export const SectionI: React.FC<SectionIProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section I: Suggestions & Closing
        </h3>
        <p className="text-sm text-green-700">
          Final suggestions and comments from the respondent and enumerator.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">
          I1. In your own words, describe the three biggest things that would
          improve youth participation and success in vegetable farming
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="1st suggestion"
            value={data.improvement1}
            onChange={(e) => onChange("improvement1", e.target.value)}
            error={errors.improvement1}
            required
            placeholder="e.g., Better extension services"
          />
          <Input
            label="2nd suggestion"
            value={data.improvement2}
            onChange={(e) => onChange("improvement2", e.target.value)}
            error={errors.improvement2}
            required
            placeholder="e.g., Access to credit"
          />
          <Input
            label="3rd suggestion"
            value={data.improvement3}
            onChange={(e) => onChange("improvement3", e.target.value)}
            error={errors.improvement3}
            required
            placeholder="e.g., Market development"
          />
        </div>
      </div>

      <Textarea
        label="I2. Any additional comments or suggestions?"
        value={data.additionalComments}
        onChange={(e) => onChange("additionalComments", e.target.value)}
        error={errors.additionalComments}
        placeholder="Please share any additional thoughts or suggestions"
        rows={4}
      />

      <Textarea
        label="Enumerator Comments"
        value={data.enumeratorComments}
        onChange={(e) => onChange("enumeratorComments", e.target.value)}
        error={errors.enumeratorComments}
        placeholder="Any observations or notes from the enumerator"
        rows={3}
      />
    </div>
  );
};
