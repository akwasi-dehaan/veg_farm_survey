import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Radio } from "../ui/Radio";
import { Checkbox } from "../ui/Checkbox";
import { YES_NO_OPTIONS } from "../../lib/types";

interface SectionDProps {
  data: {
    sellsProduce: string;
    mainBuyers: string[];
    mainBuyersOther?: string;
    sellingMethod: string;
    sellingMethodOther?: string;
    monthlyIncome: string;
    hasRegularBuyer: string;
    belongsToGroup: string;
    groupName: string;
    groupRole: string;
    groupRoleOther?: string;
    farmManagementPractices: string;
    farmManagementPracticesOther?: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  errors: { [key: string]: string };
}

const BUYER_OPTIONS = [
  { value: "local_market", label: "Local market" },
  { value: "wholesaler", label: "Wholesaler" },
  { value: "retailer", label: "Retailer" },
  { value: "direct_consumers", label: "Direct to consumers" },
  { value: "hotels_restaurants", label: "Hotels/restaurants" },
  { value: "processors_packers", label: "Processors/packers" },
  { value: "collectors_aggregators", label: "Collectors/aggregators" },
  { value: "export", label: "Export" },
  { value: "other", label: "Other" },
];

const SELLING_METHOD_OPTIONS = [
  { value: "farm_gate", label: "Farm gate" },
  { value: "transport_myself", label: "Transport to market myself" },
  { value: "transport_by_buyer", label: "Transport by buyer" },
  { value: "through_group", label: "Through group/cooperative" },
  { value: "through_broker", label: "Through broker/agent" },
  { value: "other", label: "Other" },
];

const GROUP_ROLE_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "leader", label: "Leader" },
  { value: "treasurer", label: "Treasurer" },
  { value: "other", label: "Other" },
];

const MANAGEMENT_PRACTICES_OPTIONS = [
  { value: "traditional", label: "Traditional" },
  { value: "modern", label: "Modern" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
];

export const SectionD: React.FC<SectionDProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Section D: Marketing, Income & Value Chain
        </h3>
        <p className="text-sm text-green-700">
          Information about marketing practices, income, and value chain
          participation.
        </p>
      </div>

      <Radio
        name="sellsProduce"
        label="D1. Do you sell your vegetable produce?"
        options={YES_NO_OPTIONS}
        value={data.sellsProduce}
        onChange={(value) => onChange("sellsProduce", value)}
        error={errors.sellsProduce}
        required
      />

      {data.sellsProduce === "yes" && (
        <div className="space-y-6">
          <Checkbox
            name="mainBuyers"
            label="D2. Who are your main buyers/market channel? (select all that apply)"
            options={BUYER_OPTIONS}
            values={data.mainBuyers}
            onChange={(values) => onChange("mainBuyers", values)}
            error={errors.mainBuyers}
            required
            selectAllOption
          />

          {data.mainBuyers.includes("other") && (
            <Input
              label="Please specify other buyer type"
              value={data.mainBuyersOther || ""}
              onChange={(e) => onChange("mainBuyersOther", e.target.value)}
              placeholder="Enter other buyer type"
              error={errors.mainBuyersOther}
              required
            />
          )}

          <Radio
            name="sellingMethod"
            label="D3. How do you usually sell?"
            options={SELLING_METHOD_OPTIONS}
            value={data.sellingMethod}
            onChange={(value) => onChange("sellingMethod", value)}
            error={errors.sellingMethod}
            required
          />

          {data.sellingMethod === "other" && (
            <Input
              label="Please specify other selling method"
              value={data.sellingMethodOther || ""}
              onChange={(e) => onChange("sellingMethodOther", e.target.value)}
              placeholder="Enter other selling method"
              error={errors.sellingMethodOther}
              required
            />
          )}

          <Input
            label="D4. Average monthly income from vegetable farming (estimate):"
            value={data.monthlyIncome}
            onChange={(e) => onChange("monthlyIncome", e.target.value)}
            placeholder="Enter amount and currency (e.g., 500, 1000 GHS)"
            error={errors.monthlyIncome}
            required
          />

          <Radio
            name="hasRegularBuyer"
            label="D5. Do you have a regular contract or buyer?"
            options={YES_NO_OPTIONS}
            value={data.hasRegularBuyer}
            onChange={(value) => onChange("hasRegularBuyer", value)}
            error={errors.hasRegularBuyer}
            required
          />

          <Radio
            name="belongsToGroup"
            label="D6. Do you belong to any farmer group or cooperative?"
            options={YES_NO_OPTIONS}
            value={data.belongsToGroup}
            onChange={(value) => onChange("belongsToGroup", value)}
            error={errors.belongsToGroup}
            required
          />

          {data.belongsToGroup === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name of the group/cooperative"
                value={data.groupName}
                onChange={(e) => onChange("groupName", e.target.value)}
                error={errors.groupName}
                required
              />

              <Select
                label="Your role in the group"
                options={GROUP_ROLE_OPTIONS}
                value={data.groupRole}
                onChange={(e) => onChange("groupRole", e.target.value)}
                error={errors.groupRole}
                required
                placeholder="Select your role"
              />

              {data.groupRole === "other" && (
                <Input
                  label="Please specify other group role"
                  value={data.groupRoleOther || ""}
                  onChange={(e) => onChange("groupRoleOther", e.target.value)}
                  placeholder="Enter other group role"
                  error={errors.groupRoleOther}
                  required
                />
              )}
            </div>
          )}

          <Input
            label="D7. How do you ensure farm management practices, such as record-keeping?"
            value={data.farmManagementPractices}
            onChange={(e) =>
              onChange("farmManagementPractices", e.target.value)
            }
            error={errors.farmManagementPractices}
            required
            placeholder="Enter your answer"
          />
        </div>
      )}
    </div>
  );
};
