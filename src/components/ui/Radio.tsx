import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  label,
  error,
  required = false,
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
          <div className="mt-2 space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
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

