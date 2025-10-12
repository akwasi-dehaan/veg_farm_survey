import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Radio } from "../ui/Radio";
import { CHALLENGE_OPTIONS, SEVERITY_OPTIONS } from "@/lib/types";

interface SectionFProps {
  data: {
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
  };
  onChange: (field: string, value: string | object) => void;
  errors: { [key: string]: string };
}

export const SectionF: React.FC<SectionFProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleChallengeChange = (
    challenge: string,
    field: "selected" | "severity" | "description",
    value: string | boolean | number
  ) => {
    const updatedChallenges = {
      ...data.challenges,
      [challenge]: {
        ...data.challenges[challenge],
        [field]: value,
      },
    };
    onChange("challenges", updatedChallenges);
  };

  const selectedChallenges = Object.keys(data.challenges).filter(
    (challenge) => data.challenges[challenge]?.selected
  );

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section F: Challenges & Constraints
        </h3>
        <p className="text-sm text-green-700">
          Information about challenges faced in vegetable farming and strategies
          used to address them.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">
          F1. Which of the following challenges do you face? (Tick all that
          apply; then rate severity 1–5 where 1 = Not a problem, 5 = Very
          severe)
        </h4>
        <div className="space-y-4">
          {CHALLENGE_OPTIONS.map((challenge) => (
            <div key={challenge.value} className="border rounded-lg p-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.challenges[challenge.value]?.selected || false}
                  onChange={(e) =>
                    handleChallengeChange(
                      challenge.value,
                      "selected",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {challenge.value === "other"
                    ? "n) Other (specify):"
                    : `• ${challenge.label}`}
                </span>
              </label>

              {challenge.value === "other" &&
                data.challenges[challenge.value]?.selected && (
                  <div className="mt-3">
                    <Input
                      label=""
                      value={data.challengeOther}
                      onChange={(e) =>
                        onChange("challengeOther", e.target.value)
                      }
                      placeholder="Specify other challenge"
                      error={errors.challengeOther}
                      required
                    />
                  </div>
                )}

              {data.challenges[challenge.value]?.selected && (
                <div className="mt-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Severity:
                    </span>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((severity) => (
                        <label key={severity} className="flex items-center">
                          <input
                            type="radio"
                            name={`severity-${challenge.value}`}
                            value={severity}
                            checked={
                              data.challenges[challenge.value]?.severity ===
                              severity
                            }
                            onChange={(e) =>
                              handleChallengeChange(
                                challenge.value,
                                "severity",
                                parseInt(e.target.value)
                              )
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-1 text-sm text-gray-700">
                            {severity}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedChallenges.length > 0 && (
        <Input
          label="F2. Which challenge is the single most important for you?"
          value={data.mostImportantChallenge}
          onChange={(e) => onChange("mostImportantChallenge", e.target.value)}
          placeholder="Enter the most important challenge"
          error={errors.mostImportantChallenge}
          required
        />
      )}

      <Radio
        name="triedStrategies"
        label="F3. Have you tried any strategies to reduce challenges (e.g., improved varieties, IPM, irrigation, storage)?"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        value={data.triedStrategies}
        onChange={(value) => onChange("triedStrategies", value)}
        error={errors.triedStrategies}
        required
      />

      {data.triedStrategies === "yes" && (
        <div className="space-y-4">
          <Input
            label="F3a. Which strategies?"
            value={data.strategies}
            onChange={(e) => onChange("strategies", e.target.value)}
            placeholder="Enter the strategies you have tried"
            error={errors.strategies}
            required
          />

          <Radio
            name="strategiesSuccessful"
            label="Were they successful?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "partly", label: "Partly" },
              { value: "no", label: "No" },
            ]}
            value={data.strategiesSuccessful}
            onChange={(value) => onChange("strategiesSuccessful", value)}
            error={errors.strategiesSuccessful}
            required
          />
        </div>
      )}
    </div>
  );
};
