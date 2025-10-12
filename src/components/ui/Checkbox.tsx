import React from "react";

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  options: CheckboxOption[];
  values?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  selectAllOption?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  error,
  required = false,
  options,
  values = [],
  onChange,
  className = "",
  selectAllOption = false,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (optionValue === "select-all") {
      const newValues = checked ? options.map((opt) => opt.value) : [];
      onChange?.(newValues);
    } else {
      const newValues = checked
        ? [...values, optionValue]
        : values.filter((v) => v !== optionValue);
      onChange?.(newValues);
    }
  };

  const isAllSelected = values.length === options.length;
  const isIndeterminate = values.length > 0 && values.length < options.length;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
          <div className="mt-2 space-y-2">
            {selectAllOption && (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleChange("select-all", e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Select All
                </span>
              </label>
            )}
            {options.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={values.includes(option.value)}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

