import React from "react";

interface EnumeratorInstructionsProps {
  onStart: () => void;
}

export const EnumeratorInstructions: React.FC<EnumeratorInstructionsProps> = ({
  onStart,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Enumerator Instructions & Quality Checks
        </h3>
        <p className="text-green-700">
          Please read and follow these instructions carefully before conducting
          the survey.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Survey Administration Guidelines
        </h4>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Consent Process</p>
              <p className="text-gray-700 text-sm">
                Read consent script and confirm respondent consent. If no
                consent, stop.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Question Administration
              </p>
              <p className="text-gray-700 text-sm">
                Ask questions exactly; probe for specifics when answers are
                vague (e.g., "how many kg?").
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Multi-Select Questions
              </p>
              <p className="text-gray-700 text-sm">
                For multi-selects, ensure each chosen item is recorded.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">4</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Unknown Responses</p>
              <p className="text-gray-700 text-sm">
                If respondent says "don't know," enter "DK" for open text
                fields.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">5</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Area Measurements</p>
              <p className="text-gray-700 text-sm">
                When possible, verify area by measurement or ask to estimate in
                local units; convert to hectares.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">6</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Quality Review</p>
              <p className="text-gray-700 text-sm">
                At end, review answers with respondent for obvious mistakes
                (age, totals).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">7</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Documentation</p>
              <p className="text-gray-700 text-sm">
                Take photos (if permitted) for verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h5 className="text-yellow-800 font-medium">Important Reminders</h5>
            <ul className="text-yellow-700 text-sm mt-1 space-y-1">
              <li>
                • Ensure respondent understands each question before proceeding
              </li>
              <li>• Record responses exactly as given by the respondent</li>
              <li>
                • Maintain professional and respectful communication throughout
              </li>
              <li>• Double-check all numerical values and calculations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onStart}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Start Survey
        </button>
      </div>
    </div>
  );
};
