import React from "react";
import { Radio } from "../ui/Radio";
import { Checkbox } from "../ui/Checkbox";
import { YES_NO_OPTIONS } from "../../lib/types";

interface SectionGProps {
  data: {
    ownsMobilePhone: string;
    usesInternetForFarming: string;
    platforms: string[];
    platformsOther?: string;
    wouldUseSMS: string;
    interestedInClimate: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  errors: { [key: string]: string };
}

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "tiktok", label: "TikTok" },
  { value: "farming_apps", label: "Farming apps" },
  { value: "other", label: "Other" },
];

export const SectionG: React.FC<SectionGProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section G: Technology & Information Use
        </h3>
        <p className="text-sm text-green-700">
          Information about technology use and access to digital platforms.
        </p>
      </div>

      <Radio
        name="ownsMobilePhone"
        label="G1. Do you own a mobile phone?"
        options={YES_NO_OPTIONS}
        value={data.ownsMobilePhone}
        onChange={(value) => onChange("ownsMobilePhone", value)}
        error={errors.ownsMobilePhone}
        required
      />

      <Radio
        name="usesInternetForFarming"
        label="G2. Do you use the internet or social media for farming-related information?"
        options={YES_NO_OPTIONS}
        value={data.usesInternetForFarming}
        onChange={(value) => onChange("usesInternetForFarming", value)}
        error={errors.usesInternetForFarming}
        required
      />

      {data.usesInternetForFarming === "yes" && (
        <>
          <Checkbox
            name="platforms"
            label="G3. Which platforms do you use for farming information? (Select all that apply)"
            options={PLATFORM_OPTIONS}
            values={data.platforms}
            onChange={(values) => onChange("platforms", values)}
            error={errors.platforms}
            selectAllOption
          />

          {data.platforms.includes("other") && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify other platform
              </label>
              <input
                type="text"
                value={data.platformsOther || ""}
                onChange={(e) => onChange("platformsOther", e.target.value)}
                placeholder="Enter other platform"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              {errors.platformsOther && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.platformsOther}
                </p>
              )}
            </div>
          )}
        </>
      )}

      <Radio
        name="wouldUseSMS"
        label="G4. Would you be interested in receiving SMS or voice messages about farming advice, if available?"
        options={YES_NO_OPTIONS}
        value={data.wouldUseSMS}
        onChange={(value) => onChange("wouldUseSMS", value)}
        error={errors.wouldUseSMS}
        required
      />

      <Radio
        name="interestedInClimate"
        label="G5. Are you interested in climate-smart/agroecological farming practices?"
        options={YES_NO_OPTIONS}
        value={data.interestedInClimate}
        onChange={(value) => onChange("interestedInClimate", value)}
        error={errors.interestedInClimate}
        required
      />
    </div>
  );
};
